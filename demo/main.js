let ClientAssertions = window.ClientAssertions.default;
let myLibraryInstance = new ClientAssertions();

console.log("myLibraryInstance", myLibraryInstance);

myLibraryInstance.assert('some_odd_thing', false);
