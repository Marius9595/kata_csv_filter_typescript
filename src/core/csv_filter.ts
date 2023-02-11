export class FilterCSV {
	filter(csv: string[]): string[] {
		const invoices = csv.slice(1);
		const invoice = invoices[0].split(',');
		const iva = invoice[4];
		const igic = invoice[5];
		const cif_client = invoice[7];
		const nif_client = invoice[8];
		const iva_is_declared = iva !== '';
		const igic_was_declared = igic !== '';
		if (iva_is_declared && igic_was_declared) {
			return [];
		}
		const cif_client_is_declared = cif_client !== '';
		const nif_is_declared = nif_client !== '';
		if (cif_client_is_declared && nif_is_declared) {
			return [];
		}
		return csv;
	}
}
