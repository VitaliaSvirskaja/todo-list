export function clearField(inputID: string) {
  let inputElement = document.getElementById(inputID) as HTMLInputElement;
  if (inputElement === null) {
    return;
  }
  inputElement.value = "";
}
