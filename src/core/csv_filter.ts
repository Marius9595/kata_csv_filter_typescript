export class FilterCSV {
	filter(csv: string[]): string[] {
		const invoices = csv.slice(1);
		const invoice = invoices[0].split(',');
		if (invoice[4] !== '' && invoice[5] !== '') {
			return [];
		}
		if (invoice[7] !== '' && invoice[8] !== '') {
			return [];
		}
		return csv;
	}
}
