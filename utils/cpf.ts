/**
 * Validação de CPF pelo algoritmo oficial dos dígitos verificadores.
 * Aceita CPF com ou sem máscara — a função remove qualquer caractere
 * que não seja dígito antes de validar.
 */

function calcularDigitoVerificador(cpfParcial: string): number {
  let soma = 0;
  let peso = cpfParcial.length + 1;

  for (const char of cpfParcial) {
    soma += Number(char) * peso;
    peso -= 1;
  }

  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/**
 * Retorna true se o CPF (com ou sem máscara) for válido.
 * Rejeita CPFs com menos/mais de 11 dígitos e sequências de dígitos
 * repetidos (ex: "111.111.111-11"), que passariam no cálculo mas
 * não são CPFs reais.
 */
export function validarCPF(valor: string): boolean {
  const cpf = valor.replace(/\D/g, '');

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const primeiroDigito = calcularDigitoVerificador(cpf.slice(0, 9));
  if (primeiroDigito !== Number(cpf[9])) return false;

  const segundoDigito = calcularDigitoVerificador(cpf.slice(0, 10));
  if (segundoDigito !== Number(cpf[10])) return false;

  return true;
}