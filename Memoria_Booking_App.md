PROJECTE M12 

FET PER: 
- Ismael Martínez Ortega 
- David Guo 
- Adrià González Cabanillas 

CURS : DAW 2 

ÍNDEX

Capítol 1: Introducció al Treball Final CFGS DAW
1. Justificació del projecte realitzat
2. Presentació del projecte i continguts

Capítol 2: Objectius del TF CFGS
1. Objectiu general
2. Objectius específics

Capítol 3: Anàlisi i Planificació
1. Estudi de necessitats i requisits
2. Tecnologies utilitzades
3. Planificació i metodologia de desenvolupament
4. Anàlisi DAFO
5. Diagrama de Gantt
6. Pressupost i valoració econòmica

Capítol 4: Desenvolupament de l'aplicació
1. Arquitectura del sistema
2. Disseny de la base de dades
3. Desenvolupament del backend
4. Desenvolupament del frontend
5. Integració

Capítol 5: Capítol de Proves
1. Estratègia de proves
2. Casos de prova detallats
3. Resultats i correcció d'errors

Capítol 6: Conclusions
1. Limitacions
2. Prospectiva
3. Reflexions personals de l'equip
4. Consideracions finals

Bibliografia

---

Capítol 1: Introducció al Treball Final CFGS DAW

Aquest capítol presenta el projecte de desenvolupament d'una aplicació web de reserves (Booking App), realitzat com a Treball Final del Cicle Formatiu de Grau Superior en Desenvolupament d'Aplicacions Web (DAW). El projecte integra coneixements en frontend, backend i bases de dades, oferint una solució pràctica i funcional per a la gestió de reserves en empreses de serveis.

En el context actual, on la tecnologia té un paper fonamental en la transformació digital de les empreses, aquest projecte pretén donar resposta a la necessitat de modernitzar els processos tradicionals de gestió de reserves. A més, representa una oportunitat per aplicar de manera pràctica els coneixements adquirits al llarg del cicle formatiu, posant especial èmfasi en el desenvolupament d'aplicacions web modernes, escalables i segures.

1. Justificació del projecte realitzat
La digitalització dels serveis és essencial en l'era actual, on les empreses necessiten eines eficients per gestionar reserves i millorar l'experiència del client. Molts negocis encara utilitzen sistemes manuals o poc optimitzats, cosa que pot generar errors, duplicitats i una mala gestió del temps i dels recursos.

Aquest projecte respon a aquesta necessitat mitjançant la creació d'una aplicació web que automatitza el procés de reserves, redueix errors humans i facilita l'accés als usuaris des de qualsevol dispositiu amb connexió a Internet. Això no només millora l’eficiència operativa de les empreses, sinó que també incrementa la satisfacció dels clients en oferir-los una experiència més ràpida, còmoda i accessible.

2. Presentació del projecte i continguts
El projecte consisteix en una aplicació web completa per a la gestió de reserves, accessible des del navegador i pensada per ser utilitzada tant per clients com per personal de l’empresa. Aquesta aplicació proporciona una solució centralitzada per gestionar tots els aspectes relacionats amb les reserves d’un servei.

Inclou funcionalitats com el registre i inici de sessió d’usuaris, la creació, modificació i cancel·lació de reserves, la visualització de disponibilitat mitjançant un calendari interactiu i un panell d’administració per gestionar usuaris, serveis i horaris. També es contempla la gestió de diferents rols d’usuari (client, empleat i administrador), cadascun amb permisos i funcionalitats específiques.

Els continguts del projecte abasten totes les fases del desenvolupament d’una aplicació web: des del disseny de la interfície d’usuari (UI) i l’experiència d’usuari (UX), fins al desenvolupament del backend i la creació i gestió de la base de dades.

Capítol 2: Objectius del TF CFGS

Aquest capítol defineix els objectius del projecte, establint tant la finalitat principal com els objectius específics que guien el desenvolupament de l’aplicació. Aquests objectius serveixen com a referència per assegurar que el projecte compleix amb els requisits tècnics i funcionals esperats, així com amb les competències pròpies del cicle formatiu.

1. Objectiu general
L’objectiu principal d’aquest projecte és desenvolupar una aplicació web completa, funcional i escalable per a la gestió de reserves. Aquesta aplicació ha d’integrar de manera eficient les tres capes principals d’un sistema web: el frontend, el backend i la base de dades.

2. Objectius específics
Per tal d’assolir l’objectiu general, es plantegen una sèrie d’objectius específics que cobreixen totes les fases del desenvolupament del projecte:
- Dissenyar una interfície d’usuari intuïtiva i responsive, utilitzant tecnologies com React i CSS.
- Implementar un sistema d’autenticació i autorització d’usuaris per rols (client, empleat i administrador).
- Crear una API REST amb Node.js per gestionar les operacions CRUD de reserves, usuaris i serveis.
- Dissenyar una base de dades relacional amb SQL Server per garantir la integritat de la informació.
- Realitzar proves d’integració i validació del sistema per garantir la qualitat final de l’aplicació.

Capítol 3: Anàlisi i Planificació

1. Estudi de necessitats i requisits
S'han definit els requisits funcionals (registre, login, reserves, calendari, admin) i no funcionals (seguretat JWT, rendiment < 2s, interfície responsive). El sistema ha de ser capaç de gestionar múltiples usuaris simultàniament sense perdre la coherència de les dades.

2. Tecnologies utilitzades
- Frontend: React amb Vite, HTML, CSS i JavaScript.
- Backend: Node.js amb Express.js.
- Base de dades: SQL Server.
- Eines: Visual Studio Code, Git, Postman.

3. Planificació i metodologia de desenvolupament
S'ha seguit una metodologia àgil incremental. Les fases han inclòs anàlisi, disseny de base de dades, backend, frontend i integració. El projecte ha tingut una durada total de 6 setmanes.

4. Anàlisi DAFO
Fortaleses: Ús de tecnologies modernes. Oportunitats: Digitalització de negocis locals. Debilitats: Manca d'experiència prèvia en projectes full-stack complexos. Amenaces: Limitació de temps per a funcionalitats avançades.

5. Diagrama de Gantt
La planificació s'ha estructurat de la següent manera:
- Setmana 1-2: Disseny de BD i implementació del Backend.
- Setmana 3-4: Desenvolupament del Frontend i interfaç d'usuari.
- Setmana 5: Integració de sistemes i proves inicials.
- Setmana 6: Documentació final i correcció d'errors.

6. Pressupost i valoració econòmica (RA3.7)
A continuació es detalla la valoració econòmica del projecte, considerant els costos de personal, maquinari i programari.

- Costos de personal:
L'equip està format per 3 desenvolupadors junior. S'estima una dedicació de 120 hores per membre (total 360 hores).
Cost per hora estimat: 20€/h.
Total Personal: 360h * 20€/h = 7.200€.

- Costos de maquinari:
S'han utilitzat 3 ordinadors portàtils de gamma mitjana (~900€ cadascun). S'aplica una amortització del 20% anual pel temps de projecte (1,5 mesos).
Amortització estimada: (2.700€ * 0,20) * (1,5 / 12) = 67,50€.

- Costos de llicències i programari:
S'ha optat per tecnologies de codi obert i versions gratuïtes per a desenvolupament:
Visual Studio Code: 0€
SQL Server Developer Edition: 0€
Vercel/Azure (Tiers gratuïts): 0€
Connexió a Internet i subministraments: ~150€.

- Resum del pressupost:
Personal: 7.200€
Maquinari (Amortització): 67,50€
Programari: 0€
Despeses generals: 150€
TOTAL ESTIMAT: 7.417,50€

Capítol 4: Desenvolupament de l'aplicació

1. Arquitectura del sistema
S'ha implementat una arquitectura client-servidor de tres capes: presentació (React), lògica de negoci (Node/Express) i dades (SQL Server).

2. Disseny de la base de dades
El model relacional inclou taules d'Usuaris, Rols, Serveis, Reserves i Horaris. S'ha garantit la integritat referencial mitjançant claus foranes i restriccions.

3. Desenvolupament del backend
S'ha creat una API REST amb rutes per a l'autenticació (JWT) i el manteniment de reserves i usuaris.

4. Desenvolupament del frontend
Utilitzant React, s'han creat components modulars com la Navbar, Formularis i el Calendari interactiu.

5. Integració
La comunicació entre frontend i backend s'ha realitzat mitjançant peticions asíncrones (fetch) gestionant correctament els estats de càrrega i errors.

Capítol 5: Capítol de Proves (RA4)

1. Estratègia de proves
Per garantir la robustesa del sistema, s'han realitzat proves unitàries, d'integració i de validació funcional seguint els requisits establerts.

2. Casos de prova detallats
S'han definit i executat els següents casos crítics:

- CP1: Intent de reserva sense login.
Procediment: L'usuari intenta accedir a /reserva sense haver iniciat sessió.
Resultat esperat: Redirecció automàtica a la pàgina de Login.
Resultat obtingut: Èxit. El sistema bloqueja l'accés mitjançant un "Private Route".

- CP2: Reserva en data passada.
Procediment: S'intenta seleccionar una data anterior a la d'avui en el calendari.
Resultat esperat: El sistema ha de mostrar un error o bloquejar la selecció del dia.
Resultat obtingut: Error detectat inicialment (es permetia). Es va corregir afegint una validació en el frontend i en el backend (status 400).

- CP3: Login amb credencials incorrectes.
Procediment: Introduir un correu no registrat o una contrasenya errònia.
Resultat esperat: Missatge de "Usuari o contrasenya incorrectes".
Resultat obtingut: Èxit. S'ha verificat que no es donen pistes sobre quin dels dos camps és l'erroni per seguretat.

- CP4: Solapament de reserves.
Procediment: Intentar reservar un servei en un horari que ja està ocupat per un altre usuari.
Resultat esperat: L'aplicació ha de mostrar el slot com a "Ocupat" i no permetre la inserció.
Resultat obtingut: Èxit. La base de dades retorna una violació de restricció si falla la lògica del frontend.

- CP5: Validació de camps en el registre.
Procediment: Deixar el camp de correu buit o amb un format invàlid.
Resultat esperat: Error de validació HTML5 i del servidor.
Resultat obtingut: Èxit.

3. Resultats i correcció d'errors
Durant les proves s'han trobat errors de CORS que impedien la comunicació inicial, així com un error en la gestió de les zones horàries al guardar les dates a SQL Server. Tots dos han estat resolts configurant el middleware 'cors' i normalitzant les dates a format UTC.

Capítol 6: Conclusions

1. Limitacions
El projecte no inclou notificacions push per falta de temps i tampoc s'ha implementat una passarel·la de pagament real, limitant-se a la gestió de la cita.

2. Prospectiva
Es preveu en un futur afegir un sistema de recomanacions basat en IA per als serveis i una aplicació mòbil nativa.

3. Reflexions personals de l'equip
- Ismael Martínez Ortega: "Aquest projecte m'ha permès aprofundir en la lògica de backend i la seguretat amb JWT. He après la importància d'una bona estructuració de la base de dades per evitar inconsistències en el futur."
- David Guo: "M'he centrat en el desenvolupament del frontend i he descobert el potencial de React per crear interfícies ràpides. El repte més gran ha estat la gestió d'estats globals per a les reserves."
- Adrià González Cabanillas: "La meva experiència s'ha basat en la integració total del sistema i el disseny UX/UI. He après a valorar la coordinació entre les diferents capes del projecte per oferir una experiència fluida a l'usuari."

4. Consideracions finals
La realització d’aquest projecte ha permès aplicar de manera pràctica els coneixements adquirits durant el cicle formatiu de DAW. S'han assolit els objectius plantejats inicialment i s'ha entregat un producte funcional, escalable i ben documentat.

Bibliografia
- Documentació oficial de React.
- Documentació oficial de Node.js.
- Microsoft SQL Server Documentation.
- Brown, E. (2019). Web Development with Node and Express. O'Reilly Media.
- Materials didàctics del cicle DAW.