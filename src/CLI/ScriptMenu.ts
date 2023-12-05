import { execa } from 'execa';
import inquirer from 'inquirer';
import { MainUtils } from '../main_utils';

// TODO: crea a go back submenu and exit options

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

    private async executeScript(scriptName: string, scriptCommand: string) {
        try {
            console.log('-------------------------------------*');
            console.log(`Executing package.json script: "${scriptName}": "${scriptCommand}"`);
            console.log('-------------------------------------*');
            console.log('**-------------------------------------**');
            const result = await execa('pnpm', [scriptName]);
            console.log(result.stdout);
            console.log('**-------------------------------------**');
        } catch (error) {
            console.error(`Error executing script: ${scriptName}\n`, error);
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

    public async createScriptsMenu() {
        const categories = this.categorizeScripts(this.packageJson.scripts);

        const categoryChoices = Object.keys(categories).map(category => ({
            name: category,
            value: category
        }));

        const categoryAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedCategory',
                message: 'Select a category:',
                choices: categoryChoices
            }
        ]);

        const selectedCategory = categoryAnswer.selectedCategory;
        const scriptChoices = categories[selectedCategory];

        const scriptAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedScript',
                message: `Select a script from ${selectedCategory}:`,
                choices: scriptChoices
            }
        ]);

        const selectedScript = scriptAnswer.selectedScript;
        if (selectedScript && this.packageJson.scripts[selectedScript]) {
            await this.executeScript(selectedScript, this.packageJson.scripts[selectedScript]);
        }
    }
}

(async () => {
    const scriptExecutor = new ScriptExecutor();
    await scriptExecutor.createScriptsMenu();
})();
