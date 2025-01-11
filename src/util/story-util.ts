export class StoryUtil {
	static byLinePrefix(byline: string) {
		const words = byline.toLowerCase().split(' ');
		const pressAgencyWords = ['press', 'agence', 'agency', 'agencies', 'staff', 'editorial'];
		if (words.find((word) => pressAgencyWords.includes(word))) {
			return 'Courtesy of';
		}
		return 'By';
	}
}
