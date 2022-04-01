import type { FieldError } from "react-hook-form";

function getFormErrorMessage(fieldError: FieldError | undefined) {
  if (!fieldError) {
    return undefined;
  }

  switch (fieldError.type) {
    case "required":
      return "Campo obrigatório";

    case "mustBeImage":
      return "Arquivo inválido! O arquivo precisa ser uma imagem";

    case "onlyOneImage":
      return "Selecione apenas uma imagem";

    case "lessThan5Mb":
      return "São permitidos apenas arquivos com menos de 5 megabytes";

    case "maxLength":
      return fieldError.message || "O máximo de caracteres foi ultrapassado";

    default:
      return `Erro do tipo ${fieldError.type}`;
  }
}

export { getFormErrorMessage };
