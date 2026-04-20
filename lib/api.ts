import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
  email: string;
  phone: string;
  location: string;
  resume_url: string;
  years_experience: number;
  apps_delivered: number;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string;
  order_index: number;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  order_index: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  app_store_url: string;
  play_store_url: string;
  github_url: string;
  order_index: number;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string;
  description: string;
}

export interface ContactLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

// ── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile | null> {
  const { data } = await supabase.from('profile').select('*').single();
  return data;
}

export async function upsertProfile(profile: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profile')
    .upsert({ id: 1, ...profile })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Experience ───────────────────────────────────────────────────────────────

export async function getExperience(): Promise<Experience[]> {
  const { data } = await supabase
    .from('experience')
    .select('*')
    .order('order_index');
  return data || [];
}

export async function upsertExperience(exp: Partial<Experience>) {
  const { data, error } = await supabase
    .from('experience')
    .upsert(exp)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExperience(id: number) {
  const { error } = await supabase.from('experience').delete().eq('id', id);
  if (error) throw error;
}

// ── Skills ───────────────────────────────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  const { data } = await supabase.from('skills').select('*').order('order_index');
  return data || [];
}

export async function upsertSkill(skill: Partial<Skill>) {
  const { data, error } = await supabase
    .from('skills')
    .upsert(skill)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSkill(id: number) {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}

// ── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('order_index');
  return data || [];
}

export async function upsertProject(project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .upsert(project)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: number) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// ── Education ────────────────────────────────────────────────────────────────

export async function getEducation(): Promise<Education[]> {
  const { data } = await supabase.from('education').select('*').order('id');
  return data || [];
}

export async function upsertEducation(edu: Partial<Education>) {
  const { data, error } = await supabase
    .from('education')
    .upsert(edu)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEducation(id: number) {
  const { error } = await supabase.from('education').delete().eq('id', id);
  if (error) throw error;
}

// ── Contact Links ────────────────────────────────────────────────────────────

export async function getContactLinks(): Promise<ContactLink[]> {
  const { data } = await supabase.from('contact_links').select('*').order('id');
  return data || [];
}

export async function upsertContactLink(link: Partial<ContactLink>) {
  const { data, error } = await supabase
    .from('contact_links')
    .upsert(link)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteContactLink(id: number) {
  const { error } = await supabase.from('contact_links').delete().eq('id', id);
  if (error) throw error;
}

// ── Image Upload (Supabase Storage) ──────────────────────────────────────────

/**
 * Uploads a file to Supabase Storage bucket "portfolio".
 * Returns the public URL of the uploaded file.
 *
 * Bucket setup (run once in Supabase dashboard → Storage):
 *   1. Create bucket named "portfolio" with Public access enabled
 *   2. Or run: INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
 */
export async function uploadImage(file: File, folder: 'avatars' | 'projects' = 'avatars'): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Uploads a document (like a PDF resume) to Supabase Storage.
 */
export async function uploadFile(file: File, folder: 'resumes' | 'documents' = 'resumes'): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
  return data.publicUrl;
}

