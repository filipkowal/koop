// ERROR nie pokazuje listy zamówień dopóki się nie odświeży
// Osobne productlisty dla producenta i klienta
// Zrób scheme, żeby methods przyjmowały tylko odpowiednie typy danych
// Niech wyświetla się w liście produktów ilość zamówienia (być może zrobienie jednej bazy konieczne)
// Dostosuj szerokość input w liście produktów
// W trakcie dodawania zamówienia, niech zmniejsza się ilość produktu (error jest)
// Możliwość zaznaczenia przy rejestracji czy konto to kooperant czy producent
// Stwórz konto admina
// Admin zatwierdza użytkowników


if (Meteor .isClient) {

  Template.body.events({
    "click .login"() {
      $('#modal1').openModal()
    },
    "click .logout"() {
      AccountsTemplates.logout();
    }
  });

  Template.atForm.events({
    "submit"() {
      $('#modal1').closeModal();
    }
  });
}