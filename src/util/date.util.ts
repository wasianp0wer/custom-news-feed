export default class DateUtil {
	static getTimezoneDate(zone: 'EST' | 'CST' | 'MST' | 'PST'): Date {
		switch (zone) {
			case 'EST':
				return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
			case 'CST':
				return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
			case 'MST':
				return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Denver' }));
			case 'PST':
				return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
		}
	}
}
