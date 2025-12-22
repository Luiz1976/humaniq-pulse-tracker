/**
 * Image Generator Module for Website Content
 * Simplified to use placeholders until image generation API is integrated
 */

export interface ImageGenerationResult {
    success: boolean;
    imageUrl?: string;
    imageData?: Uint8Array;
    error?: string;
    width?: number;
    height?: number;
}

/**
 * Generate image - currently returns professional placeholder
 * TODO: Integrate with working image generation service
 */
export async function generateContentImage(
    prompt: string,
    apiKey: string
): Promise<ImageGenerationResult> {
    try {
        console.log(`🎨 Image requested for: "${prompt.substring(0, 100)}..."`);

        // Using placeholder until we have working image generation
        const shortPrompt = prompt.substring(0, 60).replace(/[^a-zA-Z0-9\s]/g, '');
        const encodedText = encodeURIComponent(`HumaniQ AI - ${shortPrompt}`);
        const imageUrl = `https://via.placeholder.com/1280x720/0A85D1/FFFFFF?text=${encodedText}`;

        console.log(`✅ Placeholder generated: ${imageUrl}`);

        return {
            success: true,
            imageUrl,
            width: 1280,
            height: 720,
        };
    } catch (error) {
        console.error("Placeholder generation error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

/**
 * Upload image to Supabase Storage
 * Currently not used since we're using placeholder URLs
 */
export async function uploadImageToStorage(
    imageData: Uint8Array,
    fileName: string,
    supabaseUrl: string,
    serviceRoleKey: string
): Promise<{ url: string; path: string }> {
    const path = `posts/${fileName}`;

    // Upload to Supabase Storage
    const uploadResponse = await fetch(
        `${supabaseUrl}/storage/v1/object/website-content-images/${path}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${serviceRoleKey}`,
                "Content-Type": "image/webp",
                "x-upsert": "true",
            },
            body: imageData,
        }
    );

    if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Failed to upload image: ${uploadResponse.status} - ${errorText}`);
    }

    // Construct public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/website-content-images/${path}`;

    console.log(`✅ Image uploaded to: ${publicUrl}`);

    return { url: publicUrl, path };
}
