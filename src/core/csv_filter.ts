export class FilterCSV {
	filter(csv: string[]): string[] {
		const invoices = csv.slice(1);
		const invoice = invoices[0].split(',');
		const iva = invoice[4];
		const igic = invoice[5];
		const cif_client = invoice[7];
		const nif_client = invoice[8];
		const gross = Number.parseInt(invoice[2]);
		const net = Number.parseInt(invoice[3]);
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
		const tax_to_applied = iva_is_declared ? Number.parseInt(iva) : Number.parseInt(igic);
		const net_was_not_correctly_calculated = net !== gross - gross * (tax_to_applied / 100);
		if (net_was_not_correctly_calculated) {
			return [];
		}
		return csv;
	}
}
