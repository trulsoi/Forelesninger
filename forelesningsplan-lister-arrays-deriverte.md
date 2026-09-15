## Innholdsplan for forelesning.

Vi introduserer numerisk derivert ved å undersøke fartsmålinger.
Vi begynner med et bilde av skilt som viser gjennomsnittsmåling på en vei i en 80 sone, og tenker litt på hva det fotoboksen måler. (gjennomsnittsfart, forflytning og delta-tid)
Neste eksempel blir politimannen med radarmåling -- han vil ikke ha gjennomsnittsfarten over lengre tidspunkt, men momentanfarten -- den som står på speedometeret
I praksis kan han kun måle avstand/posisjon og tid. Vi setter opp hvordan dette kan approksimere "momentanhastigheten" og trekker inn linjen om at dett er den deriverte av posisjonsfunksjonen

Vi viser en animasjon i jsxgraph hvor en punkt (en bil, en hare el) beveger seg på en talllinje (1-d bevegelse) sammen med posisjonsgrafen
Vi har interaktive kontrollere som lar oss velge mellom ulike måter å beregne snittfart på, og lar oss "stille på delta t" som viser at den nærmer seg tangenten til kurven i pos-grafen

Formaliserer nå forover- bakover- og senterdifferanse - og regner noen få (2 eksempler) for hånd (evt viser utregning i latex el)

Neste blir å lage en testfunksjon i python / jupyterlab som vi kjenner den eksakte derivert til, og som vi kan sammenligne metodene for.
Vi gjør dette med funksjon + numpy arang/linspace forsiktig før vi meddeler at vi må se mer på disse "array" og "listene". Vi har lyst til å motivasjon for å inrodusere lister/array er for å undersøke deriverte.
(Skulle vi hatt en serie med posisjonsmålinger som vi forteller at vi vil bruke for å regne ut noe? Fritt fall og finn tyngdeakselerasjon feks? Dette er et kult eksperiment som turls kan ta på fredag. JEg tror faktisk at han har en video med et fallende objekt og synlig måleskala for man kan lese av tid  og pos = finn tyngdeaks)

Deretter viser vi arrays og lister og viktig numpy funksjoner og hvordan man jobber med numpy arrays (linspace, arange, ones, zeros, matrisemultiplikasjon (veldig enkel) logspace, sinus, cosinus exp og kanskje mer)
Vi sammenligner lister og arrays med operasjonene man får lov til å bruke og gir eksempler på når man kan bruke de.
Vi må også snakke om liste-indeksering og slicing.

Så lager vi flere plot og sammenligner eksakt og numerisk derivert visuelt, kort om absolutt feil / relativ feil og en teaser til truls og loglogplot mot h


### respons til tilbakemelding

- radarmåling bruker faktisk doppler-effekt : strålende vi legger til en Um-actually slide og lar studentene prøve å "ta meg". I en klasse på 100+ vordende ingeniørstudenter vet kanskje faktisk noen dette
- Vi har allerede sett litt på arrays, uten at de vet hva det er -- det skulle gå fint => hva er skjer egentlig her? osv 
- lister, indeksering np.array linspace og arange må tas -- zeros ones sin exp osv kan vises i en tabell, kanskje demonstreres superraskt
- Riktig -- slicing er det vi trenger for å introduserer numerisk integrasjon neste uke -- vi venter med det
- vi kan la truls få logspace og loglog plot av steglengde og fritt fall eksperimentet
- matriser kan ventes med -- de holder på med de i matten, så å vise et eksempel for å "væte" appetitten kan være lurt (teaser)
- Bra du liker jsxgraph-aktiviteten -- den er det du som skal lage, så da vet vi at den ikke svikter :) (plan b kan vurderes ;) ) 
- Håndregning er litt styr -- jeg håper latex align og fragments kan fungere i stedet - her er poenget at de må regne ut litt for hånd til eksamen. Vi må nesten ta noen eksempler


## Praktisk oppsett

Til forelesning lager vi en bok (jupyter notebook) med aktuelt innhold som vi deler med studentene.
Eventuelt er den ikke utfylt, slik at studentene kan være med å kode der det er plass for å bruke litt tid.
Jeg har et opplegg i quart med revealjs som jeg tenker passer fint frem til etter vi har tatt et eksempel for hånd og vil begynne å programmere og vise lister og arrays
Dersom hver kodecelle er "kort-nok" kan pyodide i forelesningsslidesene være en god løsning, men jeg heller mot å skifte over til jupyterhub, så lenge jeg ikke må hoppe frem og tilbake

jsxgraph har innebygd støtte i quarto nå, (extension) men jeg har en liten samling på jonajh.folk.ntnu.no nå, slik at jeg tenker vi heller legger dem her og setter inn med iframe

revealjs oppsettet mitt kan studeres på /home/jonajh/fag/pns/forelesninger

Til håndutregningen tenker jeg å "regne ut" linje for linje med fragments, eventuelt 2 kolonner.

Jeg har 3 illustrasjoner (rader, fotoboks og um-actually) som ligger i truls sitt forelesningsrepo som i grunn ville passet inn i revealjs helst.
Siden jeg har KI-hjelp tenker jeg det er lite stress å lage en "notebook" versjon av revealjs med illustrasjonene også.

webområdet mitt ligger på ~/webedit -- det er også her jeg tenker å legge og dele revealsj presentasjon










## Gjennomført oppsett (16. september 2026)

Ferdig utfylt notebook og 15 Reveal.js-lysbilder ligger på `slides-h26`.
Vi bytter én gang fra Reveal til JupyterHub. JSXGraph-aktiviteten er en egen
webside som vises i iframe, med lenke til eget vindu og statisk reservefigur.
Slicing og logspace er utelatt; matrisemultiplikasjon er en valgfri avslutning.
Studentvariant og overføring til `main`/nbgitpuller bestemmes etter gjennomgang.
Se `slides/README.md` for lenker, bygging og kontroll.


### Kommentar:

#### revealjs slides

Det ser bra ut men: Vi vil regne ut gjennomsnittsfart. bilde viser strekningsmåling fra 1km til 5km -- forflytning blir da 4km. Vi sier bilen passerer første fotoboks etter 45 sekunder og andre fotoboks etter 205 sekunder slik at forflytning / tid blir 4000 / 160 = 25 m/s (bot)
Jeg lager figur med oppsettet til utregning, fotoboks_figur.png eller noe slikt.

Figuren viser en bil som beveger seg i positiv \(s\)-retning langs en rett vei.
Ved et skilt settes startpunktet til
$$ s_0=0\text{ m}, \qquad t_0=0\text{ s}. $$
Bilen passerer deretter den første fotoboksen ved
$$ s_1=1000\text{ m}, \qquad t_1=45\text{ s}. $$
Den andre fotoboksen passeres ved
$$ s_2=5000\text{ m}, \qquad t_2=205\text{ s}. $$
Avstanden mellom de to fotoboksene er derfor
$$ \Delta s=s_2-s_1, $$
og tidsintervallet mellom passeringene er
$$ \Delta t=t_2-t_1. $$
Disse størrelsene kan brukes til å beregne for eksempel gjennomsnittsfarten mellom fotoboksene.


Til radarmålingen har jeg også lagt til en figur (radarmåling.png eller noe slikt)

Figuren viser hvordan en politibetjent måler farten til en bil ved å gjøre to raske avstandsmålinger med laser.
Ved første måling er avstanden mellom politibetjenten og bilen
$$ s_1 = 100{,}00\text{ m} $$
ved tidspunktet
$$ t_1 = 10{,}00\text{ s}. $$
Ved andre måling, \(0{,}01\) s senere, er avstanden
$$ s_2 = 99{,}75\text{ m} $$
ved tidspunktet
$$ t_2 = 10{,}01\text{ s}. $$
Bilen har altså kommet nærmere politibetjenten. Endringen i avstand er
$$ \Delta s = s_2-s_1 $$
og tidsintervallet mellom målingene er
$$ \Delta t=t_2-t_1=0{,}01\text{ s}. $$
Disse to størrelsene brukes til å beregne bilens fart fra endringen i avstand per tidsenhet.


Sliden "Hva med farten akkurat nå?" er grei - men drop "er det slik politiets rader virker?"
Neste slide gjør vi en utregning -- også kommer um actually slide. den kan stå som den er


Så ser det bra ut frem til "fra gjennomsnitt til momentan hastighet" Vi trenger en boks til om "hvorfor vi behøver en numerisk derivert": 
Hvorfor numerisk derivering?
Når vi bare har måledata eller beregnede funksjonsverdier, kan vi ikke nødvendigvis derivere en formel. I stedet anslår vi den momentane endringsraten fra små endringer i funksjonsverdiene.

 regneeksempel 1 må vi skrive opp igjen funksjonsverdiene på neste side (øverst) -- tallene ser ut til å komme fra ingensted

 gjenta også på slide for senterdiff.

Deretter er det godt


#### notebook

Dropp um actually fra notebook -- det er en liten gag som blir klein å ta opp igjen. Oppsummeringen kan kanskje funke med bare å forklare forskjellen, kanskje regne ut "radar"-eksempelet og ta gjennomsnitt i en linje eller så.

Regneeksempelene må beholdes : Det er trøbbel med latex i titlene (ser ut som du prøver å bruke mathjax notasjon? bruk $ $

Jeg ser det er trøbbel med mathjax vs $ $ flere steder i notebook -- gå gjennom og fiks



