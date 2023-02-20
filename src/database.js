import fs from 'node:fs/promises';

const databasePath = new URL('./db.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf-8')
        .then(data => {
            this.#database = JSON.parse(data);
        })
        .catch(() => {
            this.#persiste();
        })
    }

    #persiste() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select() {
        let data = this.#database ?? [];

        return data;
    }

    insert(data) {
        if (Array.isArray(this.#database)) {
            this.#database.push(data);
        } else {
            this.#database = [data]
        }

        this.#persiste();
        return data;
    }

    update(id, data) {
        const rowIndex = this.#database.findIndex((row) => row.id === id);

        if (rowIndex > -1) {
            this.#database[rowIndex] = {
                ...this.#database[rowIndex],
                ...data,
                updated_at: new Date().toISOString()
            };
            
            this.#persiste();
            return this.#database[rowIndex];
        } else {
            return new Error('Task not found');
        }
    }

    taskCompleted(id) {
        const rowIndex = this.#database.findIndex((row) => row.id === id);

        if (rowIndex > -1) {
            this.#database[rowIndex] = {
                ...this.#database[rowIndex],
                completed_at: new Date().toISOString()
            };

            this.#persiste();
            return this.#database[rowIndex];
        } else {
            return new Error('Task not found');
        }
    }

    delete(id) {
        const rowIndex = this.#database.findIndex((row) => row.id === id);

        if (rowIndex > -1) {
            this.#database.splice(rowIndex, 1);
        } else {
            return new Error('Task not found');
        }
    }
}