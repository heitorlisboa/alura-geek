import { util, z, type ZodErrorMap, ZodIssueCode, ZodParsedType } from "zod";

const errorMap: ZodErrorMap = (issue, _ctx) => {
  let message: string;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Obrigatório";
      } else {
        message = `Tipo esperado era ${issue.expected}, porém foi recebido ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Valor literal inválido, era esperado ${JSON.stringify(
        issue.expected,
        util.jsonStringifyReplacer
      )}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Chave(s) não reconhecida(s) no objeto: ${util.joinValues(
        issue.keys,
        ", "
      )}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Valor inválido`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Valor discriminador inválido. Era esperado ${util.joinValues(
        issue.options
      )}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Valor do enum inválido. Era esperado ${util.joinValues(
        issue.options
      )}, porém foi recebido '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Argumentos da função inválidos`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Tipo de retorno da função inválido`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Data inválida`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("startsWith" in issue.validation) {
          message = `Valor inválido: precisa começar com "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Valor inválido: precisa terminar com "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation === "email") {
        message = `E-mail inválido`;
      } else if (issue.validation === "datetime") {
        message = `Formato de data e hora inválido`;
      } else if (issue.validation !== "regex") {
        message = `${issue.validation.toUpperCase()} inválido`;
      } else {
        message = "Formato inválido";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `O array deve conter ${
          issue.exact
            ? "exatamente"
            : issue.inclusive
            ? `no mínimo`
            : `mais que`
        } ${issue.minimum} elemento(s)`;
      else if (issue.type === "string")
        message = `A string deve conter ${
          issue.exact ? "exatamente" : issue.inclusive ? `no mínimo` : `mais de`
        } ${issue.minimum} caractere(s)`;
      else if (issue.type === "number")
        message = `O número deve ser ${
          issue.exact
            ? `exatamente igual a`
            : issue.inclusive
            ? `maior ou igual a`
            : `maior que`
        } ${issue.minimum}`;
      else if (issue.type === "date")
        message = `A data deve ser ${
          issue.exact
            ? `exatamente igual a`
            : issue.inclusive
            ? `maior ou igual a`
            : `maior que`
        } ${new Date(issue.minimum)}`;
      else if (issue.type === "set")
        message = `O set deve conter ${
          issue.exact
            ? "exatamente"
            : issue.inclusive
            ? `no mínimo`
            : `mais que`
        } ${issue.minimum} elemento(s)`;
      else util.assertNever(issue.type);
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `O array deve conter ${
          issue.exact
            ? `exatamente`
            : issue.inclusive
            ? `no máximo`
            : `menos que`
        } ${issue.maximum} elemento(s)`;
      else if (issue.type === "string")
        message = `A string deve conter ${
          issue.exact
            ? `exatamente`
            : issue.inclusive
            ? `no máximo`
            : `menos de`
        } ${issue.maximum} caractere(s)`;
      else if (issue.type === "number")
        message = `O número deve ser ${
          issue.exact
            ? `exatamente`
            : issue.inclusive
            ? `menor ou igual a`
            : `menor que`
        } ${issue.maximum}`;
      else if (issue.type === "date")
        message = `A data deve ser ${
          issue.exact
            ? `exatamente`
            : issue.inclusive
            ? `menor ou igual a`
            : `menor que`
        } ${new Date(issue.maximum)}`;
      else if (issue.type === "set")
        message = `O set deve conter ${
          issue.exact
            ? `exatamente`
            : issue.inclusive
            ? `no máximo`
            : `menos que`
        } ${issue.maximum} elemento(s)`;
      else util.assertNever(issue.type);
      break;
    case ZodIssueCode.custom:
      message = `Valor inválido`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Resultados da interseção não puderam ser mesclados`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `O número deve ser múltiplo de ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Número deve ser finito";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};

z.setErrorMap(errorMap);
