import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';
import { imageCache } from './imageCache';
import defaultPic from '@/src/assets/default_profile.png';

const unsplash = createApi({
    accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
    fetch: nodeFetch
});

export const getRandomPhoto = async (query) => {
    try {
        if (!query) {
            return defaultPic.src;
        }

        const cacheKey = `photo_${query}`;
        const cachedImage = imageCache.get(cacheKey);
        
        if (cachedImage) {
            console.log('Imagen obtenida desde caché:', query);
            return cachedImage;
        }

        // Si es una URL completa, devolverla directamente
        if (query.startsWith('http')) {
            return query;
        }

        // Usar imagen por defecto mientras se carga
        const defaultImageUrl = defaultPic.src;
        
        try {
            const result = await unsplash.photos.getRandom({
                query: query,
                orientation: 'portrait'
            });

            if (result.response?.urls?.small) {
                imageCache.set(cacheKey, result.response.urls.small);
                return result.response.urls.small;
            }
        } catch (unsplashError) {
            console.warn('Error al obtener imagen de Unsplash:', unsplashError);
        }

        return defaultImageUrl;
        
    } catch (error) {
        console.error('Error al obtener la foto:', error);
        return defaultPic.src;
    }
}