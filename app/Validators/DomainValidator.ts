import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class DomainValidator {
  constructor(protected ctx: HttpContextContract) { }

  private urlSchema = Env.get('NODE_ENV') !== 'production' ?
    schema.string({ trim: true }) :
    schema.string({ trim: true }, [
      rules.url({
        protocols: ['http', 'https'],
        requireTld: true,
        requireProtocol: false,
        requireHost: false,
        bannedHosts: ['zerologin.co'],
      }),
    ])
  public schema = schema.create({
    zerologinUrl: this.urlSchema,
    rootUrl: this.urlSchema,
    secret: schema.string({ trim: true }),
    issueCookies: schema.boolean(),
    tokenName: schema.string.optional([
      rules.requiredWhen('issueCookies', '=', true),
      rules.trim(),
      rules.escape(),
    ]),
    refreshTokenName: schema.string.optional([
      rules.requiredWhen('issueCookies', '=', true),
      rules.trim(),
      rules.escape(),
    ]),
  })

  public messages = {
    'required': 'The {{ field }} is required',
    'rootUrl.url': 'Root url must be a valid url (eg. domain.com)',
    'zerologinUrl.url': 'Zerologin url must be a valid url (eg. domain.com)',
  }
}
