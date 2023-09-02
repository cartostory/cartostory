import fs from 'fs/promises'
import handlebars from 'handlebars'
import path from 'path'

type Template = 'sign-up'

class TemplateReader {
  public async readTemplate(templateName: Template) {
    const templateFile = await this.getTemplateFile(templateName)
    const templateSpec = handlebars.compile(templateFile)

    return templateSpec
  }

  private async getTemplateFile(template: Template) {
    const templateFile = await fs.readFile(
      path.resolve(__dirname, `../../../templates/${template}.handlebars`),
      'utf-8',
    )
    return templateFile
  }
}

export { TemplateReader }
