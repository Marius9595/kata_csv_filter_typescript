import { FilterCSV } from '../core/csv_filter';

/*

Headers: Num_invoice, Date, Gross, Net ,IVA, IGIC, Concept, CIF_client, NIF_client

    A correct invoice must not change
    - ["1,02/05/2019,1008,810,19,,ACERLaptop,B76430134"] -> 1,02/05/2019,1008,810,19,,ACERLaptop,B76430134,]

    IVA and IGIC are mutually exclusive
    - "<Num_invoice>,<Date>,<Gross>,<Net>,19,19,<Concept>,<NIF_client>,<CIF_client>" -> []

    CIF_client and NIF_client are mutually exclusive
    - ["<Num_invoice>,<Date>,<Gross>,<Net>,<IVA>,<IGIC>,<Concept>,B76430134,F74433134"] -> []

    Net = Gross - Gross * Taxes(IVA or IGIC)
    - ["<Num_invoice>,<Date>,100,120,19,,<Concept>,<NIF_client>,<CIF_client>"] -> []

    If there are more than one facture with same reference (number of facture), these are invalid
    - [
        "1,<Date>,<Gross>,<Net>,<IVA>,<IGIC>,<Concept>,<NIF_client>,<CIF_client>",   ->  []
        "1,<Gross>,<Net>,<IVA>,<IGIC>,<Concept>,<NIF_client>,<CIF_client>",
      ]

    Borderline cases
    - [] -> []
    - ["1,02/05/2019,1008,810,19,,ACERLaptop,B76430134"] -> Error
 */

interface StubInvoiceParams {
	num_invoice?: string;
	date?: string;
	gross?: string;
	net?: string;
	iva?: string;
	igic?: string;
	concept?: string;
	cif_client?: string;
	nif_client?: string;
}

describe('filter csv should', () => {
	const header = 'Num_invoice,Date,Gross,Net,IVA,IGIC,Concept,CIF_client,NIF_client';

	function StubInvoiceHaving({
		num_invoice = '1',
		date = '02/05/2019',
		gross = '100',
		net = '80',
		iva = '20',
		igic = '',
		concept = 'concept of invoice',
		cif_client = 'B76430134',
		nif_client = '',
	}: StubInvoiceParams) {
		return [num_invoice, date, gross, net, iva, igic, concept, cif_client, nif_client].join(',');
	}

	it('not filter correct invoices', () => {
		const invoice = StubInvoiceHaving({});
		const csv = [header, invoice];

		const csv_filtered = new FilterCSV().filter(csv);

		expect(csv_filtered).toBe(csv);
	});

	it('filter an invoice with IVA and IGIC declared because are mutually exclusive', () => {
		const invoice = StubInvoiceHaving({ igic: '20', iva: '20' });
		const csv = [header, invoice];

		const csv_filtered = new FilterCSV().filter(csv);

		expect(csv_filtered).toStrictEqual([]);
	});

	it('filter an invoice with NIF_client and CIF_client declared because are mutually exclusive', () => {
		const invoice = StubInvoiceHaving({ nif_client: 'F74433134', cif_client: 'B76430134' });
		const csv = [header, invoice];

		const csv_filtered = new FilterCSV().filter(csv);

		expect(csv_filtered).toStrictEqual([]);
	});

	it('filter an invoice whose net was not correctly calculated', () => {
		const invoice = StubInvoiceHaving({ gross: '100', iva: '20', net: '90' });
		const csv = [header, invoice];

		const csv_filtered = new FilterCSV().filter(csv);

		expect(csv_filtered).toStrictEqual([]);
	});
});
