import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select();
            
            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;

            if (!title || !description) {
                return res.writeHead(400).end(JSON.stringify({ message: 'Title and description are required' }));
            }

            const id = randomUUID();

            const task = database.insert(
                {
                    id,
                    title,
                    description,
                    completed_at: null,
                    created_at: new Date().toISOString(),
                    updated_at: null
                }
            );

            return res.end(JSON.stringify(task));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;

            if (!title || !description) {
                return res.writeHead(400).end(JSON.stringify({ message: 'Title and description are required' }));
            }

            const response = database.update(id, { title, description });
            
            if (response instanceof Error) {
                return res.writeHead(404).end(JSON.stringify({ message: response.message }));
            }

            return res.end(JSON.stringify(response));
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            const response = database.taskCompleted(id);

            if (response instanceof Error) {
                return res.writeHead(404).end(JSON.stringify({ message: response.message }));
            }

            return res.end(JSON.stringify(task));
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            const response = database.delete(id);

            if (response instanceof Error) {
                return res.writeHead(404).end(JSON.stringify({ message: response.message }));
            }
            return res.end(JSON.stringify({ message: 'Task deleted' }));
        }
    }
]