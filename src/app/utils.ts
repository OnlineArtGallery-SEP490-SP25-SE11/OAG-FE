import { useSafeParams } from '@/lib/params';
import { jwtDecode } from 'jwt-decode';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

export const AUTHENTICATION_ERROR_MESSAGE =
	'You must be logged in to view this content';

export const PRIVATE_GROUP_ERROR_MESSAGE =
	'You do not have permission to view this group';

export const AuthenticationError = class AuthenticationError extends Error {
	constructor() {
		super(AUTHENTICATION_ERROR_MESSAGE);
		this.name = 'AuthenticationError';
	}
};

export const PrivateGroupAccessError = class PrivateGroupAccessError extends Error {
	constructor() {
		super(PRIVATE_GROUP_ERROR_MESSAGE);
		this.name = 'PrivateGroupAccessError';
	}
};

export const NotFoundError = class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
};

export const isTokenExpired = (token: string) => {
	if (!token) return true;
	try {
		const decoded = jwtDecode(token);
		const now = Math.floor(Date.now() / 1000);
		return decoded.exp! <= now;
	} catch (error) {
		console.error('Error decoding token:', error);
		return true;
	}
};

export function sanitizeBlogContent(html: string): string {
	return sanitizeHtml(html);
}

export function stripHtmlTags(content: string): string {
	return content
		.replace(/<[^>]+>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

export function createExcerpt(html: string, maxLength: number = 135): string {
	const cleanText = stripHtmlTags(html);

	if (cleanText.length <= maxLength) {
		return cleanText;
	}

	const lastSpace = cleanText.lastIndexOf(' ', maxLength);
	const cutoff = lastSpace > -1 ? lastSpace : maxLength;

	return `${cleanText.substring(0, cutoff)}...`;
}

export function calculateReadingTime(content: string): number {
	const plainText = stripHtmlTags(sanitizeBlogContent(content));
	const words = plainText.split(/\s+/).length;
	const wordsPerMinute = 200;

	return Math.ceil(words / wordsPerMinute);
}

// Simple language detection function
// Enhanced language detection function
export const detectLanguage = (text: string): string => {
	// Return default for empty text
	const normalizedText = text.trim();
	if (!normalizedText) {
	  return 'en-US';
	}
	
	// Expanded language patterns with common words and unique characters
	const patterns = {
	  en: /\b(the|is|are|and|in|to|of|for|with|you|that|have|this|it|on|was|not|be|they|but|from|at|his|her|by|will|we|my|our|their|what|who|when|how|there|would|could|should|has|can|an|as|if|about|which|your|one|all|were|been|do|does|did|had|very|just|so|some|like|more|than|only|now|them|i)\b/gi,
	  vi: /\b(của|là|và|trong|cho|với|bạn|rằng|có|này|không|đã|được|những|các|một|người|về|tôi|khi|từ|đến|cũng|như|ở|thì|đi|nếu|còn|vì|sẽ|phải|mình|chúng|họ|ai|gì|làm|tại|nhiều|hay|rất|năm|sau|trước|lại|đó|nơi|theo|qua|hoặc|bởi|đang|mọi|nên|nào)\b/gi,
	  fr: /\b(le|la|les|un|une|des|et|est|sont|de|à|pour|avec|ce|cette|il|elle|sur|que|qui|dans|par|au|aux|plus|mais|ou|où|donc|car|si|votre|notre|mon|ma|mes|nous|vous|ils|elles|leur|leurs|du|en|je|tu|ne|pas)\b/gi,
	  es: /\b(el|la|los|las|un|una|unos|unas|y|es|son|de|a|para|con|este|esta|en|que|por|su|sus|al|del|lo|como|más|pero|o|u|si|mi|mis|tu|tus|nos|nuestro|nuestra|él|ella|ellos|ellas|no|muy)\b/gi,
	  de: /\b(der|die|das|ein|eine|und|ist|sind|von|zu|für|mit|dem|den|des|in|auf|bei|aus|nach|über|unter|vor|hinter|neben|zwischen|wenn|aber|oder|als|wie|so|nur|noch|mehr|weil|durch|gegen|ohne|um|bis)\b/gi,
	  zh: /[\u4e00-\u9fff\u3400-\u4dbf]/g,
	  ja: /[\u3040-\u309f\u30a0-\u30ff]/g,
	  ko: /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/g,
	  ru: /[\u0400-\u04ff]/g,
	  ar: /[\u0600-\u06ff]/g,
	  hi: /[\u0900-\u097f]/g,
	  th: /[\u0e00-\u0e7f]/g
	};
	
	// Language specific scoring characteristics
	const languageCharacteristics = {
	  zh: { characterWeight: 5 }, // Give higher weight to Chinese characters
	  ja: { characterWeight: 5 }, // Give higher weight to Japanese characters
	  ko: { characterWeight: 5 }, // Give higher weight to Korean characters
	  ru: { characterWeight: 3 }, // Give higher weight to Cyrillic characters
	  ar: { characterWeight: 3 }, // Give higher weight to Arabic characters
	  hi: { characterWeight: 3 }, // Give higher weight to Devanagari characters
	  th: { characterWeight: 3 }, // Give higher weight to Thai characters
	  en: { characterWeight: 1 },
	  vi: { characterWeight: 1 },
	  fr: { characterWeight: 1 },
	  es: { characterWeight: 1 },
	  de: { characterWeight: 1 }
	};
	
	// Store scores for each language
	const scores: Record<string, number> = {};
	
	// Calculate scores based on word/character matches
	Object.entries(patterns).forEach(([lang, pattern]) => {
	  const matches = (normalizedText.match(pattern) || []);
	  const weight = languageCharacteristics[lang as keyof typeof languageCharacteristics]?.characterWeight || 1;
	  
	  // For character-based languages, count occurrences differently
	  if (['zh', 'ja', 'ko', 'ru', 'ar', 'hi', 'th'].includes(lang)) {
		scores[lang] = matches.length * weight;
	  } else {
		// For word-based languages, consider both count and ratio to text length
		const wordCount = normalizedText.split(/\s+/).length;
		if (wordCount > 0) {
		  scores[lang] = (matches.length / wordCount) * 100 * weight;
		} else {
		  scores[lang] = 0;
		}
	  }
	});
	
	// Handle special cases for short texts
	if (normalizedText.length < 15) {
	  // Prioritize character-based detection for very short texts
	  for (const lang of ['zh', 'ja', 'ko', 'ru', 'ar', 'hi', 'th']) {
		if (scores[lang] > 0) {
		  const languageMap: Record<string, string> = {
			en: 'en-US',
			vi: 'vi-VN',
			fr: 'fr-FR',
			es: 'es-ES',
			de: 'de-DE',
			zh: 'zh-CN',
			ja: 'ja-JP',
			ko: 'ko-KR',
			ru: 'ru-RU',
			ar: 'ar-SA',
			hi: 'hi-IN',
			th: 'th-TH'
		  };
		  return languageMap[lang];
		}
	  }
	}
	
	// Find the language with the highest score
	let maxScore = 0;
	let detectedLang = 'en'; // Default to English
	
	Object.entries(scores).forEach(([lang, score]) => {
	  if (score > maxScore) {
		maxScore = score;
		detectedLang = lang;
	  }
	});
	
	// Map the language code to BCP47 format
	const languageMap: Record<string, string> = {
	  en: 'en-US',
	  vi: 'vi-VN',
	  fr: 'fr-FR',
	  es: 'es-ES',
	  de: 'de-DE',
	  zh: 'zh-CN',
	  ja: 'ja-JP',
	  ko: 'ko-KR',
	  ru: 'ru-RU',
	  ar: 'ar-SA',
	  hi: 'hi-IN',
	  th: 'th-TH'
	};
	
	// Apply confidence threshold - if no language reaches a minimum confidence, use default
	if (maxScore < 3 && detectedLang !== 'en') {
	  // Additional analysis for ambiguous cases
	  const latinScript = /[a-zA-Z]/.test(normalizedText);
	  const hasSpecialChars = /[áàãâéèêíìîóòõôúùûçñäëïöüÿ]/.test(normalizedText);
	  
	  if (latinScript && !hasSpecialChars) {
		detectedLang = 'en'; // Default to English for Latin script without special chars
	  }
	}
	
	return languageMap[detectedLang] || 'en-US';
  };

export function useBlogIdParam() {
	const { blogId } = useSafeParams(
		z.object({ blogId: z.string().pipe(z.coerce.number()) })
	);
	return blogId;
}
