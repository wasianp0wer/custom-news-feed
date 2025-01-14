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
