import crypto from "crypto";
import {promises as fs} from "fs";

class ServiceManager {

    constructor(path) {
        this.path = path;
    }

    async readServices() {
        try {
            const data = await fs.readFile(this.path, "utf-8");

            if (!data || data.trim() === "") {
                throw new Error("Servicios no encontrados");
            }

            console.log(data)
            return JSON.parse(data);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async writeServices(services) {
        try {
            await fs.writeFile(this.path, JSON.stringify(services, null, 2));
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getServices() {
        return await this.readServices();
    }

    async getServicesById(id) {
        try {
            const services = await this.readServices();
            const service =  services?.find(service => service.id === id);

            if(!service) {
                throw new Error("Servicio no encontrado");
            }

            return service;
        } catch(error) {
            console.log(error)
            return null
        }
        
    }

    async createService(name, description, duration, price, category, available) {
        try {
            if(!name || !description || !duration || !price || !category || !available) {
                throw new Error("Todos los campos son requeridos");
            }
            const services = await this.readServices();

            const newService = {
                id: crypto.randomUUID(),
                name,
                description,
                duration,
                price,
                category,
                available
            };

            services.push(newService);
            await this.writeServices(services);
            return newService;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateService(id, data) {
        try {
            const services = await this.readServices();
            const idx = services.findIndex(service => service.id === id)

            if (idx === -1) { 
                throw new Error("Servicio no encontrado");
            }

            if(data.id) {
                throw new Error("El ID no puede ser modificado")
            }

            services[idx] = {
                ...services[idx],
                ...data
            }

            await this.writeServices(services)
            return services[idx]
        } catch (error) {
            console.error(error);
            return null;
        }

    }

    async deleteService(id) {
        try {
            const services = await this.readServices()
            const idx = services.findIndex(service => service.id === id)

            if (idx === -1) { 
                throw new Error("Servicio no encontrado"); 
            }

            const deletedService = services.splice(idx,1)[0]
            await this.writeServices(services)
            return deletedService
        } catch(error) {
            console.log(error);
            return null
        }
    }
}

export default ServiceManager;