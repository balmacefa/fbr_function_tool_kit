import { execa } from 'execa';
import inquirer from 'inquirer';
import { MainUtils } from '../main_utils';


interface PackageJson {
    scripts: Record<string, string>;
}

// TODO: create a similar concept of game loop, to easy check for go back option or exit, 
// to easy check command excution type based on string key like s3 does you know.
// this way we don need to reed to the enteries logic process
/**<fbr_auto_gen id='uuid@' > >>
cual quier cose 
</fbr_auto_gen>
**/

// TODO: convert to regex<fbr_auto_gen id='uuid@'> any character...

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

        if (selectedCategory === 'customCommand') {
            await this.executeCliScriptMenu();
            return;
        }

        const selectedScript = await this.buildScriptMenu(selectedCategory);

        if (selectedScript === 'goBack') {
            return this.createScriptsMenu();
        } else if (selectedScript && this.packageJson.scripts[selectedScript]) {
            await this.executeScript('pnpm', [selectedScript]);
        }
    }

    private async executeCliScriptMenu() {
        const cliChoices = this.generateCliScriptChoices();
        const cliScriptAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedCliScript',
                message: 'Select a CLI script to execute:',
                choices: cliChoices
            }
        ]);

        if (cliScriptAnswer.selectedCliScript !== 'goBack') {
            await this.executeCliScript(cliScriptAnswer.selectedCliScript);
        }
    }

    private generateCliScriptChoices() {
        // ... implementation to generate CLI script choices ...
        // Todo: fix
        const file_path_list = MainUtils.by_extesion('.cli.ts')
        // Todo: show the UI option and excution
        const options = [
            new inquirer.Separator(),
            { name: '--> Exit main menu todu --> 👨‍🚒🧯🔥', value: 'exit' },
            new inquirer.Separator(),
        ];
        // TODO: add goBack option 
        for (const path of file_path_list) {
            console.log(path);
            options.push(
                new inquirer.Separator(),
            )
            options.push(
                { name: '--> Custom Command --> 🛠️', value: `customCommand__${path}` },
            )
        }
        return options;
    }

    private async executeCliScript(cliScript: string) {
        // Assuming CLI scripts can be executed with a specific command, like ts-node
        await this.executeScript('tsx', [cliScript]);
    }

}

(async () => {
    const scriptExecutor = new ScriptExecutor();
    await scriptExecutor.createScriptsMenu();
})();
