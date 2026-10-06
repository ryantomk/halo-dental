"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession, logAdminAction } from "@/lib/admin/auth";
import {
  patientSchema,
  adminAppointmentSchema,
  rescheduleAppointmentSchema,
  availabilityBlockSchema,
  serviceFormSchema,
  blogPostFormSchema,
  galleryItemFormSchema,
  testimonialFormSchema,
  type PatientInput,
  type AdminAppointmentInput,
  type RescheduleAppointmentInput,
  type AvailabilityBlockInput,
  type ServiceFormInput,
  type BlogPostFormInput,
  type GalleryItemFormInput,
  type TestimonialFormInput,
} from "@/lib/validations/adminSchema";
import { checkSlotAvailable, type AvailabilityBlock } from "@/lib/booking/availability";

// ============================================================================
// 1. AUTHENTICATION ACTIONS
// ============================================================================

export async function adminLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  try {
    const supabase = createServerSupabase();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { error: authError?.message || "Invalid email or password." };
    }

    // Verify staff_users record
    const adminClient = createAdminClient();
    const { data: staffUser, error: staffError } = await adminClient
      .from("staff_users")
      .select("*")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (staffError || !staffUser || !staffUser.is_active) {
      await supabase.auth.signOut();
      return { error: "Your staff account is not authorized or has been deactivated." };
    }

    await logAdminAction({
      staffUserId: staffUser.id,
      action: "staff.login",
      entityType: "staff_users",
      entityId: staffUser.id,
      details: { email: staffUser.email, role: staffUser.role },
    });
  } catch (err) {
    console.error("[adminLogin] Unexpected error:", err);
    return { error: "An unexpected error occurred during login. Please try again." };
  }

  redirect("/admin");
}

export async function adminLogout() {
  try {
    const session = await requireAdminSession();
    if (session) {
      await logAdminAction({
        staffUserId: session.staffUser.id,
        action: "staff.logout",
        entityType: "staff_users",
        entityId: session.staffUser.id,
      });
    }
    const supabase = createServerSupabase();
    await supabase.auth.signOut();
  } catch {
    // Ignore session errors on sign-out
  }
  redirect("/admin/login");
}

// ============================================================================
// 2. PATIENT ACTIONS
// ============================================================================

export async function createPatientAction(rawInput: PatientInput) {
  const session = await requireAdminSession();
  const validation = patientSchema.safeParse(rawInput);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Validation failed.",
    };
  }

  const { fullName, phone, email, dateOfBirth, gender, notes } = validation.data;
  const adminClient = createAdminClient();

  // Prevent duplicate patient phone
  const { data: existing } = await adminClient
    .from("patients")
    .select("id, full_name")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      error: `A patient with phone number ${phone} already exists (${existing.full_name}).`,
      existingPatientId: existing.id,
    };
  }

  const { data: newPatient, error } = await adminClient
    .from("patients")
    .insert({
      full_name: fullName,
      phone,
      email: email || null,
      date_of_birth: dateOfBirth || null,
      gender: gender || null,
      notes: notes || null,
    })
    .select("id, full_name, phone, email")
    .single();

  if (error || !newPatient) {
    console.error("[createPatientAction] Error:", error);
    return { success: false, error: "Failed to create patient record." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "patient.create",
    entityType: "patients",
    entityId: newPatient.id,
    details: { fullName, phone },
  });

  revalidatePath("/admin/patients");
  return { success: true, patient: newPatient };
}

export async function updatePatientAction(id: string, rawInput: PatientInput) {
  const session = await requireAdminSession();
  const validation = patientSchema.safeParse(rawInput);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Validation failed.",
    };
  }

  const { fullName, phone, email, dateOfBirth, gender, notes } = validation.data;
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("patients")
    .update({
      full_name: fullName,
      phone,
      email: email || null,
      date_of_birth: dateOfBirth || null,
      gender: gender || null,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[updatePatientAction] Error:", error);
    return { success: false, error: "Failed to update patient record." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "patient.update",
    entityType: "patients",
    entityId: id,
    details: { fullName, phone },
  });

  revalidatePath("/admin/patients");
  return { success: true };
}

export async function deletePatientAction(id: string) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  // Safety check: ensure patient has no non-cancelled appointments
  const { data: appointments } = await adminClient
    .from("appointments")
    .select("id, status")
    .eq("patient_id", id)
    .neq("status", "cancelled");

  if (appointments && appointments.length > 0) {
    return {
      success: false,
      error: "Cannot delete patient because they have active or past appointment records.",
    };
  }

  const { error } = await adminClient.from("patients").delete().eq("id", id);

  if (error) {
    console.error("[deletePatientAction] Error:", error);
    return { success: false, error: "Failed to delete patient record." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "patient.delete",
    entityType: "patients",
    entityId: id,
  });

  revalidatePath("/admin/patients");
  return { success: true };
}

// ============================================================================
// 3. APPOINTMENT ACTIONS & DOUBLE-BOOKING PROTECTION
// ============================================================================

function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HD-${year}-${randomChars}`;
}

export async function createAdminAppointmentAction(rawInput: AdminAppointmentInput) {
  const session = await requireAdminSession();
  const validation = adminAppointmentSchema.safeParse(rawInput);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Validation failed.",
    };
  }

  const {
    patientId,
    serviceId,
    doctorId,
    appointmentDate,
    appointmentTime,
    source,
    adminNotes,
    patientNotes,
  } = validation.data;

  // 1. Strict Server-Side Double-Booking & Sunday Check
  const isAvailable = await checkSlotAvailable(
    appointmentDate,
    appointmentTime,
    doctorId || null
  );

  if (!isAvailable) {
    return {
      success: false,
      error: "This time slot is no longer available. Please choose another time.",
    };
  }

  const adminClient = createAdminClient();
  const referenceCode = generateReferenceCode();

  const { data: newAppt, error } = await adminClient
    .from("appointments")
    .insert({
      patient_id: patientId,
      service_id: serviceId,
      doctor_id: doctorId || null,
      clinic_id: session.staffUser.clinic_id || null,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      duration_minutes: 30,
      status: "confirmed",
      source: source || "phone",
      admin_notes: adminNotes || null,
      patient_notes: patientNotes || null,
      reference_code: referenceCode,
    })
    .select("id, reference_code")
    .single();

  if (error || !newAppt) {
    console.error("[createAdminAppointmentAction] Error:", error);
    return { success: false, error: "Failed to create appointment in database." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "appointment.create_manual",
    entityType: "appointments",
    entityId: newAppt.id,
    details: {
      referenceCode,
      date: appointmentDate,
      time: appointmentTime,
      patientId,
      serviceId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/availability");
  return { success: true, referenceCode, appointmentId: newAppt.id };
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show",
  adminNotes?: string
) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  const updatePayload: {
    status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
    updated_at: string;
    admin_notes?: string | null;
  } = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (adminNotes !== undefined) {
    updatePayload.admin_notes = adminNotes;
  }

  const { error } = await adminClient
    .from("appointments")
    .update(updatePayload)
    .eq("id", appointmentId);

  if (error) {
    console.error("[updateAppointmentStatusAction] Error:", error);
    return { success: false, error: "Failed to update appointment status." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: `appointment.status_${status}`,
    entityType: "appointments",
    entityId: appointmentId,
    details: { newStatus: status, adminNotes },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/availability");
  return { success: true };
}

export async function rescheduleAppointmentAction(rawInput: RescheduleAppointmentInput) {
  const session = await requireAdminSession();
  const validation = rescheduleAppointmentSchema.safeParse(rawInput);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Validation failed.",
    };
  }

  const { appointmentId, newDate, newTime, doctorId } = validation.data;

  // Verify that target slot is available (excluding this appointment itself)
  const isAvailable = await checkSlotAvailable(
    newDate,
    newTime,
    doctorId || null,
    appointmentId
  );

  if (!isAvailable) {
    return {
      success: false,
      error: "This time slot is no longer available. Please choose another time.",
    };
  }

  const adminClient = createAdminClient();

  // Fetch previous details for audit logging
  const { data: oldAppt } = await adminClient
    .from("appointments")
    .select("appointment_date, appointment_time, admin_notes")
    .eq("id", appointmentId)
    .single();

  const noteAddition = `[Rescheduled from ${oldAppt?.appointment_date || "N/A"} ${oldAppt?.appointment_time || "N/A"} on ${new Date().toLocaleDateString("en-IN")}]`;
  const newAdminNotes = oldAppt?.admin_notes ? `${oldAppt.admin_notes} | ${noteAddition}` : noteAddition;

  const { error } = await adminClient
    .from("appointments")
    .update({
      appointment_date: newDate,
      appointment_time: newTime,
      doctor_id: doctorId || null,
      admin_notes: newAdminNotes,
      status: "confirmed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointmentId);

  if (error) {
    console.error("[rescheduleAppointmentAction] Error:", error);
    return { success: false, error: "Failed to reschedule appointment." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "appointment.reschedule",
    entityType: "appointments",
    entityId: appointmentId,
    details: {
      oldDate: oldAppt?.appointment_date,
      oldTime: oldAppt?.appointment_time,
      newDate,
      newTime,
      doctorId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/availability");
  return { success: true };
}

// ============================================================================
// 4. AVAILABILITY BLOCK ACTIONS
// ============================================================================

export async function createAvailabilityBlockAction(rawInput: AvailabilityBlockInput) {
  const session = await requireAdminSession();
  const validation = availabilityBlockSchema.safeParse(rawInput);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Validation failed.",
    };
  }

  const { blockDate, startTime, endTime, doctorId, reason } = validation.data;
  const adminClient = createAdminClient();

  // 1. Try inserting into dedicated availability_blocks table
  const newBlock: AvailabilityBlock = {
    id: crypto.randomUUID(),
    clinic_id: session.staffUser.clinic_id || null,
    doctor_id: doctorId || null,
    block_date: blockDate,
    start_time: startTime,
    end_time: endTime,
    reason: reason || "Clinic blocked slot",
    created_by: session.staffUser.id,
    created_at: new Date().toISOString(),
  };

  const { error: insertErr } = await adminClient
    .from("availability_blocks" as any)
    .insert(newBlock);

  if (insertErr) {
    // 2. Fallback to site_settings array if dedicated table not yet migrated
    const { data: currentSettings } = await adminClient
      .from("site_settings")
      .select("id, value")
      .eq("key", "availability_blocks")
      .maybeSingle();

    let existingBlocks: AvailabilityBlock[] = [];
    if (currentSettings && Array.isArray(currentSettings.value)) {
      existingBlocks = currentSettings.value as unknown as AvailabilityBlock[];
    }

    const updatedBlocks = [...existingBlocks, newBlock];

    if (currentSettings) {
      await adminClient
        .from("site_settings")
        .update({
          value: updatedBlocks as any,
          updated_by: session.staffUser.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentSettings.id);
    } else {
      await adminClient.from("site_settings").insert({
        key: "availability_blocks",
        value: updatedBlocks as any,
        description: "Clinic schedule and doctor availability blocks",
        is_public: true,
        updated_by: session.staffUser.id,
      });
    }
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "availability.block_created",
    entityType: "availability_blocks",
    entityId: newBlock.id,
    details: { blockDate, startTime, endTime, reason, doctorId },
  });

  revalidatePath("/admin/availability");
  revalidatePath("/admin/calendar");
  revalidatePath("/booking");
  revalidatePath("/ml/booking");
  return { success: true, blockId: newBlock.id };
}

export async function deleteAvailabilityBlockAction(blockId: string) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  // 1. Try deleting from dedicated table
  const { error } = await adminClient
    .from("availability_blocks" as any)
    .delete()
    .eq("id", blockId);

  // 2. Also remove from site_settings store if present
  const { data: currentSettings } = await adminClient
    .from("site_settings")
    .select("id, value")
    .eq("key", "availability_blocks")
    .maybeSingle();

  if (currentSettings && Array.isArray(currentSettings.value)) {
    const existing = currentSettings.value as unknown as AvailabilityBlock[];
    const filtered = existing.filter((b) => b.id !== blockId);
    await adminClient
      .from("site_settings")
      .update({
        value: filtered as any,
        updated_by: session.staffUser.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentSettings.id);
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "availability.block_removed",
    entityType: "availability_blocks",
    entityId: blockId,
  });

  revalidatePath("/admin/availability");
  revalidatePath("/admin/calendar");
  revalidatePath("/booking");
  revalidatePath("/ml/booking");
  return { success: true };
}

// ============================================================================
// 5. SERVICES MANAGEMENT
// ============================================================================

export async function saveServiceAction(id: string | null, rawInput: ServiceFormInput) {
  const session = await requireAdminSession();
  const validation = serviceFormSchema.safeParse(rawInput);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Please check the service details.",
    };
  }

  const data = validation.data;
  const nameEn = (data.name || data.nameEn || "").trim();
  const nameMl = (data.nameMl || nameEn).trim(); // automatic fallback if staff enters single English name
  const slug = (data.slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")).trim();
  const shortDesc = data.shortDescription || data.shortDescriptionEn || "";
  const fullDesc = data.description || data.descriptionEn || "";

  const adminClient = createAdminClient();
  const payload = {
    name_en: nameEn,
    name_ml: nameMl,
    slug,
    category: data.category || "general",
    duration_minutes: data.durationMinutes || 30,
    price_display: data.priceDisplay || null,
    price_starting_at: data.priceStartingAt ?? null,
    short_description_en: shortDesc || null,
    short_description_ml: data.shortDescriptionMl || shortDesc || null,
    description_en: fullDesc || null,
    description_ml: data.descriptionMl || fullDesc || null,
    image_url: data.imageUrl || null,
    is_featured: data.isFeatured,
    is_active: data.isActive,
    sort_order: data.sortOrder,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await adminClient.from("services").update(payload).eq("id", id);
    if (error) {
      console.error("[saveServiceAction update] Error:", error);
      return { success: false, error: "Failed to update service. Please try again." };
    }
  } else {
    const { error } = await adminClient.from("services").insert(payload);
    if (error) {
      console.error("[saveServiceAction insert] Error:", error);
      if (error.code === "23505") {
        return { success: false, error: "A service with this name or slug already exists. Please choose a different name." };
      }
      return { success: false, error: "Failed to create service. Please verify the information." };
    }
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: id ? "service.update" : "service.create",
    entityType: "services",
    entityId: id || slug,
    details: { name: nameEn, isActive: data.isActive },
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/ml/services");
  revalidatePath("/booking");
  revalidatePath("/ml/booking");
  return { success: true };
}

export async function deleteServiceAction(id: string) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("services").delete().eq("id", id);
  if (error) {
    console.error("[deleteServiceAction] Error:", error);
    return { success: false, error: "Cannot delete this service because existing appointments reference it. You can deactivate it instead to hide it from the website." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "service.delete",
    entityType: "services",
    entityId: id,
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/ml/services");
  revalidatePath("/booking");
  revalidatePath("/ml/booking");
  return { success: true };
}

export async function toggleServiceStatusAction(id: string, isActive: boolean) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("services")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: "Failed to update service status." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: isActive ? "service.activate" : "service.deactivate",
    entityType: "services",
    entityId: id,
  });

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/ml/services");
  return { success: true };
}

// ============================================================================
// 6. TESTIMONIALS MANAGEMENT
// ============================================================================

export async function saveTestimonialAction(id: string | null, rawInput: TestimonialFormInput) {
  const session = await requireAdminSession();
  const validation = testimonialFormSchema.safeParse(rawInput);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Please check the testimonial details.",
    };
  }

  const {
    patientName,
    quote,
    rating,
    treatment,
    serviceId,
    photoUrl,
    isApproved,
    isFeatured,
    displayOrder,
  } = validation.data;

  const adminClient = createAdminClient();
  const payload = {
    patient_name: patientName,
    quote_en: quote,
    quote_ml: quote, // fallback
    rating,
    treatment,
    service_id: serviceId || null,
    photo_url: photoUrl || null,
    is_approved: isApproved,
    is_featured: isFeatured,
    display_order: displayOrder,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await adminClient.from("testimonials").update(payload).eq("id", id);
    if (error) {
      console.error("[saveTestimonialAction update] Error:", error);
      return { success: false, error: "Failed to update review." };
    }
  } else {
    const { error } = await adminClient.from("testimonials").insert(payload);
    if (error) {
      console.error("[saveTestimonialAction insert] Error:", error);
      return { success: false, error: "Failed to save review." };
    }
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: id ? "testimonial.update" : "testimonial.create",
    entityType: "testimonials",
    entityId: id || patientName,
    details: { patientName, rating, isApproved },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/ml");
  return { success: true };
}

export async function updateTestimonialModerationAction(id: string, isApproved: boolean) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("testimonials")
    .update({ is_approved: isApproved, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: "Failed to update testimonial status." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: isApproved ? "testimonial.approve" : "testimonial.reject",
    entityType: "testimonials",
    entityId: id,
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/ml");
  return { success: true };
}

export async function deleteTestimonialAction(id: string) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("testimonials").delete().eq("id", id);
  if (error) {
    return { success: false, error: "Failed to delete testimonial." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "testimonial.delete",
    entityType: "testimonials",
    entityId: id,
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/ml");
  return { success: true };
}

// ============================================================================
// 7. GALLERY MANAGEMENT
// ============================================================================

export async function saveGalleryItemAction(id: string | null, rawInput: GalleryItemFormInput) {
  const session = await requireAdminSession();
  const validation = galleryItemFormSchema.safeParse(rawInput);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Please check the gallery item details.",
    };
  }

  const {
    title,
    description,
    isBeforeAfter,
    beforeImageUrl,
    afterImageUrl,
    serviceId,
    treatmentDuration,
    isPublished,
    displayOrder,
  } = validation.data;

  const adminClient = createAdminClient();
  const finalBefore = beforeImageUrl;
  const finalAfter = isBeforeAfter && afterImageUrl ? afterImageUrl : beforeImageUrl;

  const payload = {
    title_en: title,
    title_ml: title, // fallback
    description_en: description || null,
    description_ml: description || null,
    before_image_url: finalBefore,
    after_image_url: finalAfter,
    service_id: serviceId || null,
    treatment_duration: treatmentDuration || null,
    is_published: isPublished,
    display_order: displayOrder,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await adminClient.from("gallery_items").update(payload).eq("id", id);
    if (error) {
      console.error("[saveGalleryItemAction update] Error:", error);
      return { success: false, error: "Failed to update gallery photo." };
    }
  } else {
    const { error } = await adminClient.from("gallery_items").insert(payload);
    if (error) {
      console.error("[saveGalleryItemAction insert] Error:", error);
      return { success: false, error: "Failed to save gallery photo." };
    }
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: id ? "gallery.update" : "gallery.create",
    entityType: "gallery_items",
    entityId: id || title,
    details: { title, isPublished },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/ml/gallery");
  return { success: true };
}

export async function toggleGalleryItemPublishAction(id: string, isPublished: boolean) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("gallery_items")
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: "Failed to update gallery item status." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: isPublished ? "gallery.publish" : "gallery.unpublish",
    entityType: "gallery_items",
    entityId: id,
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/ml/gallery");
  return { success: true };
}

export async function deleteGalleryItemAction(id: string) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("gallery_items").delete().eq("id", id);
  if (error) {
    return { success: false, error: "Failed to delete gallery item." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "gallery.delete",
    entityType: "gallery_items",
    entityId: id,
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/ml/gallery");
  return { success: true };
}

// ============================================================================
// 8. BLOG MANAGEMENT
// ============================================================================

export async function saveBlogPostAction(id: string | null, rawInput: BlogPostFormInput) {
  const session = await requireAdminSession();
  const validation = blogPostFormSchema.safeParse(rawInput);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Please check the blog post details.",
    };
  }

  const {
    title,
    excerpt,
    content,
    category,
    coverImageUrl,
    authorId,
    status,
  } = validation.data;

  const adminClient = createAdminClient();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const payload: {
    title_en: string;
    title_ml?: string | null;
    slug: string;
    category: string;
    content_en: string;
    content_ml?: string | null;
    excerpt_en?: string | null;
    excerpt_ml?: string | null;
    cover_image_url?: string | null;
    author_id?: string | null;
    status: "draft" | "published" | "archived";
    published_at?: string | null;
    updated_at: string;
  } = {
    title_en: title,
    title_ml: title, // fallback
    slug,
    category: category || "Dental Health",
    content_en: content,
    content_ml: content, // fallback
    excerpt_en: excerpt || null,
    excerpt_ml: excerpt || null,
    cover_image_url: coverImageUrl || null,
    author_id: authorId || null,
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "published") {
    payload.published_at = new Date().toISOString();
  }

  if (id) {
    const { error } = await adminClient.from("blog_posts").update(payload).eq("id", id);
    if (error) {
      console.error("[saveBlogPostAction update] Error:", error);
      return { success: false, error: "Failed to update article." };
    }
  } else {
    const { error } = await adminClient.from("blog_posts").insert(payload);
    if (error) {
      console.error("[saveBlogPostAction insert] Error:", error);
      if (error.code === "23505") {
        return { success: false, error: "An article with this title already exists. Please choose a different title." };
      }
      return { success: false, error: "Failed to create article." };
    }
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: id ? `blog.update` : `blog.create_${status}`,
    entityType: "blog_posts",
    entityId: id || slug,
    details: { title, status },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/ml/blog");
  return { success: true };
}

export async function toggleBlogPostStatusAction(id: string, status: "published" | "draft") {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  const payload: {
    status: "draft" | "published" | "archived";
    updated_at: string;
    published_at?: string | null;
  } = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "published") {
    payload.published_at = new Date().toISOString();
  }

  const { error } = await adminClient.from("blog_posts").update(payload).eq("id", id);
  if (error) {
    return { success: false, error: "Failed to update blog post status." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: `blog.${status}`,
    entityType: "blog_posts",
    entityId: id,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/ml/blog");
  return { success: true };
}

export async function deleteBlogPostAction(id: string) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("blog_posts").delete().eq("id", id);
  if (error) {
    return { success: false, error: "Failed to delete blog post." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "blog.delete",
    entityType: "blog_posts",
    entityId: id,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/ml/blog");
  return { success: true };
}

// ============================================================================
// 9. IMAGE UPLOAD
// ============================================================================

export async function uploadAdminImageAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const session = await requireAdminSession();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: "Please select an image file to upload." };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "Image file size exceeds the 10MB limit." };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Unsupported format. Please upload a JPG, PNG, WebP, or SVG." };
    }

    const adminClient = createAdminClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    const cleanExt = ["jpg", "jpeg", "png", "webp", "svg"].includes(ext) ? ext : "webp";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadErr } = await adminClient.storage
      .from("clinic-public")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadErr) {
      console.error("[uploadAdminImageAction] Storage error:", uploadErr);
      return { success: false, error: "Could not upload image to storage. Please try again." };
    }

    const { data: pubData } = adminClient.storage.from("clinic-public").getPublicUrl(fileName);

    await logAdminAction({
      staffUserId: session.staffUser.id,
      action: "storage.upload",
      entityType: "storage.objects",
      entityId: fileName,
      details: { folder, size: file.size, type: file.type },
    });

    return { success: true, url: pubData.publicUrl };
  } catch (err: any) {
    console.error("[uploadAdminImageAction] Exception:", err);
    return { success: false, error: "An unexpected error occurred during upload." };
  }
}

// ============================================================================
// 8. SITE SETTINGS
// ============================================================================

export async function updateClinicContactAction(data: {
  phone: string;
  whatsapp: string;
  email: string;
  address_line1: string;
  address_line2?: string;
  opening_hours?: Record<string, string>;
}) {
  const session = await requireAdminSession();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("clinics")
    .update({
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      address_line1: data.address_line1,
      address_line2: data.address_line2 || null,
      opening_hours: (data.opening_hours || {}) as any,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.staffUser.clinic_id || "22c7e5ce-340d-4c33-a83f-dda41af69843");

  if (error) {
    return { success: false, error: "Failed to update clinic contact information." };
  }

  await logAdminAction({
    staffUserId: session.staffUser.id,
    action: "settings.update_clinic",
    entityType: "clinics",
    entityId: session.staffUser.clinic_id,
    details: data,
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/ml");
  return { success: true };
}
