import DateUtil from './date.util';

export default class GameUtil {
	static getDailySeed(): number {
		const today = DateUtil.getTimezoneDate('PST');
		return Math.pow(today.getFullYear(), today.getDate() + 5) / (today.getMonth() + 1);
	}
}
