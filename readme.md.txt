By stworzyć użytkowników z rolami, odkomentuj kod w isServer. Potem można się logować na następujących użytkowników:
Wszyscy użytkownicy mają pass: 123456
Klient: klient@example.com
producent: producent@example.com
admin: admin@example.com

ZADANIA Z [V] SĄ UKOŃCZONE. ! OZNACZA PILNE/WAŻNE ZADANIA

[v] Przenieś opracje na bazie do method
[v] Stwórz typy użytkowników i do walidacje po typach http://guide.meteor.com/accounts.html#roles-and-permissions
[v] Materialize
[v]ERROR nie pokazuje listy zamówień dopóki się nie odświeży(showOrders się uruchamia, ale i tak nie pokazuje. 
Wygląda na to że problem jest po stronie clienta, bo chwilkę czasem widać zamówienia)
	[v] 	Subskrybcje przeniesione tak by aktywowały się gdy ładuje się odpowiedni template
	[ ]	! ERROR select do zamawiania nie pokazuje się dopóki się nie odświeży
! ERROR dla nowego użytkownika, nie działa dodawanie do zamówień
! ERROR funkcja dodawania do zamówień odpala się dwukrotnie
[v] Client: Osobne templatey productlisty dla producenta i klienta
Widoczna strzałka od sortowania listy produktów i zamówień
Opis długi po kliknięciu ikonki obok opisu krótkiego
Najechanie myszką podświetla wiersz tabeli (materialize)
Możliwość dodania zdjęcia do produktu
W tabeli poziome kreski oddzielające produkty z wzg. Na kryterium sortowania
[v] Dostosuj szerokość input w liście produktów
Niech wyświetla się w liście produktów ilość zamówienia nawet po odświeżeniu
[v] Logowanie z użyciem materialize
	[v] Przycisk loginu
	[v] Przycisk logoutu
	[ ]bezpieczeństwo

scheme, żeby methods przyjmowały tylko odpowiednie typy danych
! W trakcie dodawania zamówienia, niech zmniejsza się ilość produktu (orderedQuantity się zwiększa)
! Producent automatyczne przypisywany do produktu
Możliwość zaznaczenia przy rejestracji czy konto to kooperant czy producent
! Stwórz konto admina
	Widoczna lista użytkowników
		Admin zatwierdza nowych użytkowników
		Admin przydiela role 
		Admin usuwa konta
! Konto paczkowacza
	Lista userów i ich zamówień
routing https://kadira.io/academy/meteor-routing-guide/content/implementing-auth-logic-and-permissions
