export default class GameUtil {
	static getDailySeed(): number {
		const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
		return Math.pow(today.getFullYear(), today.getDate() + 5) / (today.getMonth() + 1);
	}
}
