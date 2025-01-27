export class StoryUtil {
	static byLinePrefix(byline: string) {
		const words = byline.toLowerCase().split(' ');
		const pressAgencyWords = ['press', 'agence', 'agency', 'agencies', 'staff', 'editorial'];
		if (words.find((word) => pressAgencyWords.includes(word))) {
			return 'Courtesy of';
		}
		return 'By';
	}

	static getTimeSincePublished(publishedAt: Date): TimeAgo {
		const now = new Date();
		const diff = now.getTime() - publishedAt.getTime();
		const diffInMinutes = Math.floor(diff / 60000);
		if (diffInMinutes < 60) {
			return { value: diffInMinutes, unit: TimeUnit.MINUTE };
		}
		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return { value: diffInHours, unit: TimeUnit.HOUR };
		}
		const diffInDays = Math.floor(diffInHours / 24);
		return { value: diffInDays, unit: TimeUnit.DAY };
	}

	static hashObject(obj: any): string {
		const jsonString = JSON.stringify(obj);
		let hash = 5381;
		for (let i = 0; i < jsonString.length; i++) {
			hash = (hash * 33) ^ jsonString.charCodeAt(i);
		}
		return (hash >>> 0).toString(); // Ensure the hash is a positive integer
	}
}

export interface TimeAgo {
	value: number;
	unit: TimeUnit;
}

export enum TimeUnit {
	MINUTE = 'minute',
	HOUR = 'hour',
	DAY = 'day'
}
