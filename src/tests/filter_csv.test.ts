import { FilterCSV } from '../core/csv_filter';

/*

Headers: Num_invoice, Date, Gross, Net ,IVA, IGIC, Concept, CIF_client, NIF_client

    A correct invoice must not change
    - ["1,02/05/2019,1008,810,19,,ACERLaptop,B76430134"] -> 1,02/05/2019,1008,810,19,,ACERLaptop,B76430134,]

    IVA and IGIC are mutually exclusive
    - "<Num_invoice>,<Date>,<Gross>,<Net>,19,19,<Concept>,<NIF_client>,<CIF_client>" -> []

    CIF_client and NIF_client are mutually exclusive
    - ["<Num_invoice>,<Date>,<Gross>,<Net>,<IVA>,<IGIC>,<Concept>,B76430134,F74433134"] -> []

    Net = Gross * Taxes(IVA or IGIC)
    - ["<Num_invoice>,<Date>,100,119,19,,<Concept>,<NIF_client>,<CIF_client>"] -> ["<Num_invoice>,<Date>,100,119,19,,<Concept>,<NIF_client>,<CIF_client>"]
    - ["<Num_invoice>,<Date>,100,119,,19,<Concept>,<NIF_client>,<CIF_client>"] -> ["<Num_invoice>,<Date>,100,119,,19,<Concept>,<NIF_client>,<CIF_client>"]
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

describe('filter csv should', () => {
	const header = 'Num_invoice,Date,Gross,Net,IVA,IGIC,Concept,CIF_client,NIF_client';

	it('not filter correct invoices', () => {
		const invoice = '1,02/05/2019,1008,810,19,,ACERLaptop,B76430134,';
		const csv = [header, invoice];

		const csv_filtered = new FilterCSV().filter(csv);

		expect(csv_filtered).toBe(csv);
	});

	it('filter a invoice with IVA and IGIC declared because are mutually exclusive', () => {
		const invoice = '1,02/05/2019,1008,810,19,19,ACERLaptop,B76430134,';
		const csv = [header, invoice];

		const csv_filtered = new FilterCSV().filter(csv);

		expect(csv_filtered).toStrictEqual([]);
	});

	it('filter a invoice with NIF_client and CIF_client declared because are mutually exclusive', () => {
		const invoice = '1,02/05/2019,1008,810,19,,ACERLaptop,B76430134,F74433134';
		const csv = [header, invoice];

		const csv_filtered = new FilterCSV().filter(csv);

		expect(csv_filtered).toStrictEqual([]);
	});
});
