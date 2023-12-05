import { execa } from 'execa';
import inquirer from 'inquirer';
import { MainUtils } from '../main_utils';


interface PackageJson {
    scripts: Record<string, string>;
}

class ScriptExecutor {
    private packageJson: PackageJson;

    constructor() {
        this.packageJson = this.readPackageJson();
    }

    private readPackageJson(): PackageJson {
        const data = MainUtils.read_file_from_root('package.json').fileContent;
        return JSON.parse(data);
    }

    private async executeScript(script: string, args: string[] = []) {
        try {
            console.log('-------------------------------------*');
            console.log(`Executing command: "${script} ${args.join(' ')}"`);
            console.log('-------------------------------------*');
            console.log('**-------------------------------------**');
            const result = await execa(script, args);
            console.log(result.stdout);
            console.log('**-------------------------------------**');
        } catch (error) {
            console.error(`Error executing script: ${script}\n`, error);
        }
    }

    private categorizeScripts(scripts: PackageJson['scripts']) {
        const categories: any = {};

        Object.entries(scripts).forEach(([key, value]) => {
            const [category, scriptName] = key.split(':');
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push({ name: scriptName || key, value: key, script: value });
        });

        return categories;
    }
    private generateCategoryChoices(categories: any) {
        return [
            ...Object.keys(categories).map(category => ({
                name: category,
                value: category
            })),
            new inquirer.Separator(),
            { name: '--> Custom Command --> 🛠️', value: 'customCommand' },
            new inquirer.Separator(),
            { name: '--> Exit --> 👨‍🚒🧯🔥', value: 'exit' }
        ];
    }

    private async buildCategoryMenu() {
        const categories = this.categorizeScripts(this.packageJson.scripts);
        const categoryChoices = this.generateCategoryChoices(categories);

        const categoryAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedCategory',
                message: 'Select a category, execute a custom command, or exit:',
                choices: categoryChoices
            }
        ]);

        return categoryAnswer.selectedCategory;
    }

    private async buildScriptMenu(category: string) {
        const categories = this.categorizeScripts(this.packageJson.scripts);

        const scriptChoices = [
            ...categories[category],
            new inquirer.Separator(),
            { name: '🙃🫣 <-- Go Back to main', value: 'goBack' }
        ];

        const scriptAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedScript',
                message: `Select a script from ${category} or go back:`,
                choices: scriptChoices
            }
        ]);

        return scriptAnswer.selectedScript;
    }
    public async createScriptsMenu(): Promise<any> {
        const selectedCategory = await this.buildCategoryMenu();

        if (selectedCategory === 'exit') {
            return;
        }

        // TODO: separate into small func
        if (selectedCategory === 'customCommand') {
            const command = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'command',

                    // TODO: Change this to a list of sub_menu options reading file with extesion using MainUtils to get file with extesion .cli.ts
                    // And then excute the command using tsx
                    message: 'Enter the command to execute:'
                }
            ]);
            const args = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'args',
                    message: 'Enter the arguments (separate with space):'
                }
            ]);
            await this.executeScript(command.command, args.args.split(' '));
            return;
        }

        const selectedScript = await this.buildScriptMenu(selectedCategory);

        if (selectedScript === 'goBack') {
            return this.createScriptsMenu();
        } else if (selectedScript && this.packageJson.scripts[selectedScript]) {
            await this.executeScript('pnpm', [selectedScript]);
        }
    }
}

(async () => {
    const scriptExecutor = new ScriptExecutor();
    await scriptExecutor.createScriptsMenu();
})();
