# Forelesning 16. september 2026

Dette er forfatteroppsettet på grenen `slides-h26`. `main` er fortsatt grenen
for studentdistribusjon med nbgitpuller. Ikke flett hele denne grenen inn i
`main`: velg senere hvilke notebookfiler studentene skal få.

## Bruk i forelesningen

1. Åpne [lysbildene](https://jonajh.folk.ntnu.no/INGA1002/forelesning/03-numerisk-derivasjon/).
   Piltastene viser utregningene trinnvis; `S` åpner forelesernotatene.
2. Aktiviteten ligger i lysbildene, med lenke til et eget vindu og en statisk
   reservefigur. Velg funksjon, differansemetode, tidspunkt og skrittlengde.
3. Bytt én gang til JupyterHub på siste lysbilde. Åpne
   `Uke38_Numerisk_derivasjon_arrays.ipynb` og start ved
   «Her starter programmeringsdelen». Notebookens første del oppsummerer slides.

Notebooken er ferdig utfylt, med kjørte celler og fem figurer. De tre innledende
bildene ligger som vedlegg i notebooken, så den kan flyttes alene. En eventuell
studentvariant med uutfylte celler og distribusjon gjennom `main` bestemmes senere.

Kjernen er differanseformler, lister/indeksering, elementvise arrayoperasjoner,
arange/linspace, enkel plotting og absolutt/relativ feil. Matrisecellen er valgfri.
Slicing, logspace/loglog, dataanalyse og subplot er ikke gjennomgått her.

## Redigering og bygging

- Notebook: rediger `Uke38_Numerisk_derivasjon_arrays.ipynb` direkte i Jupyter.
- Lysbilder: `slides/numerisk-derivasjon/index.qmd` og `theme.scss`.
- Aktivitet: `aktiviteter/numerisk-derivasjon/`. JSXGraph 1.11.1 leveres lokalt.
- Bildene i lysbildene bruker de eksisterende filene under `Figurer/`.

Med Quarto installert, kjør fra roten av repoet:

```bash
python3 verktoy/bygg_webpakke.py /tmp/inga-web
python3 -m http.server --directory /tmp/inga-web 8000
```

Åpne `http://localhost:8000/INGA1002/forelesning/03-numerisk-derivasjon/`.
Outputmappen må være ny. Byggeskriptet publiserer ingenting.
Den relative iframe-lenken krever denne mappestrukturen; åpning av `_site/index.html`
alene gir derfor ikke en fungerende aktivitet.

Ved publisering kopieres pakkens to undermapper til tilsvarende stier under
`~/webedit/INGA1002/`: `forelesning/03-numerisk-derivasjon/` og
`aktiviteter/numerisk-derivasjon/`. Notebooken på web må kopieres på nytt etter
notebookendringer. Lysbildenes bilder, stil og KaTeX er innebygd i HTML-filen.

Quarto 1.7.32 gir på denne maskinen en advarsel om eksport av SCSS-fargevariabler.
CSS kompileres likevel, og resultatet er kontrollert i nettleseren.

## Kontroll

Med `nbformat`, `nbclient`, `ipykernel`, `numpy` og `matplotlib` installert:

```bash
python3 verktoy/kontroller_notebook.py
```

Dette kjører notebooken fra en frisk Python-kjerne, kontrollerer de numeriske
eksemplene og oppdaterer lagrede resultater. Kontrollen gjelder de utfylte
standardeksemplene; den må tilpasses hvis funksjoner eller eksempelverdier endres.

Nettlesertesten krever Node, Puppeteer og Chromium/Brave:

```bash
WEB_ROOT=/tmp/inga-web BROWSER_PATH=/usr/bin/chromium node verktoy/test_browser.cjs
```

`PUPPETEER_MODULE` kan angi modulsti hvis Puppeteer ikke ligger i lokal `node_modules`.
Testen kontrollerer 54 numeriske kombinasjoner, animasjon, mobilbredde, lysbildenes
layout og formler samt at iframe-aktiviteten fungerer. Skjermbilder legges i
en midlertidig mappe, som skrives ut av testen.
