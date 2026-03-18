function validation(values) {

  let errors = {}

  if (!values.name) {
    errors.name = "Nome é obrigatório"
  }

  if (!values.email) {
    errors.email = "Email é obrigatório"
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email inválido"
  }

  if (!values.password) {
    errors.password = "Senha é obrigatória"
  } else if (values.password.length < 6) {
    errors.password = "Senha deve ter pelo menos 6 caracteres"
  }

  return errors
}