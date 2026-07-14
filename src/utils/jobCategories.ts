import type { CareerJob } from './careers';

export interface JobCategory {
  id: string;
  name: string;
  order: number;
  published: boolean;
  description?: string;
  jobs?: string[];
  slug: string;
}

export interface JobCategoryWithJobs extends JobCategory {
  jobListings: CareerJob[];
}

/**
 * Fetch job categories from API endpoint (for client-side use)
 */
export async function fetchJobCategories(): Promise<JobCategory[]> {
  try {
    const response = await fetch('/api/job-categories');
    if (!response.ok) {
      throw new Error('Failed to fetch job categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching job categories:', error);
    return [];
  }
}

/**
 * Organize jobs by categories based on CMS configuration
 */
export function organizeJobsByCategories(
  categories: JobCategory[],
  jobs: CareerJob[]
): JobCategoryWithJobs[] {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  return categories.map(category => {
    const categoryName = String(category.name || '').trim();
    const categorySlug = String(category.slug || '').trim();
    const categoryId = String(category.id || '').trim();
    const acceptableCategoryValues = new Set(
      [categoryName, categorySlug, categoryId]
        .filter(Boolean)
        .flatMap(value => [value, normalize(value)]),
    );

    // Find jobs that belong to this category
    let categoryJobs: CareerJob[] = [];

    if (category.jobs && category.jobs.length > 0) {
      // Use the jobs specified in the category's multi-reference field
      categoryJobs = jobs.filter(job =>
        category.jobs!.includes(job.slug || normalize(job.title || ''))
      );
    } else {
      // Match by jobCategory/category fields or legacy department with flexible values.
      categoryJobs = jobs.filter(job => {
        const jobValueCandidates = [
          (job as any).jobCategory,
          (job as any).category,
          job.department,
        ]
          .filter(Boolean)
          .flatMap(value => {
            const raw = String(value).trim();
            return [raw, normalize(raw)];
          });

        return jobValueCandidates.some(value => acceptableCategoryValues.has(value));
      });
    }

    return {
      ...category,
      jobListings: categoryJobs,
    };
  });
}



/**
 * Get category color - standardized to purple for all categories
 */
export function getCategoryColor(order: number): string {
  // All categories now use primary (purple) color for consistent styling
  return 'primary';
}
