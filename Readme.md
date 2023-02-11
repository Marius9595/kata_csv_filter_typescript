# Kata csv filter with typescript

Skipping the reading and loading of csv files. You have to develop the logic behind filter behaviour that has to meet the following bussiness rules:
- Some fields can be empty (consecutives commas or a final comma)
- If there are more than one facture with same reference (number of facture), these are invalid
- IVA and IGIC are mutually exclusive. If some facture has the two ones declared, it is a invalid facture
- CIF and NIF are mutually exclusive. If some facture has the two ones declared, it is a invalid facture
- Net is the result of applying sum of gross and his corresponding tax. If this is not met, it is a invalid facture

The csv has the following headers:

`Num_bill, Date, Gross, IVA, IGIC, Concept, CIF_client, NIF_client`
## Instructions
* `npm upgrade`
* `npm install`
* `npm test`

Check this course! [testingsostenible.com](https://testingsostenible.com).

![Testing Sostenible con TypeScript](cover.png)

### ESLint
[TypeScript ESLint Rules](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)

### Husky hooks
* Pre-commit: Execute npm analize (tsc + eslint --fix)
* Pre-push: Execute test
