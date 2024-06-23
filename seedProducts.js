// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Import mongoose to interact with MongoDB
import mongoose from 'mongoose';

// Import Product model and functions from Product.mjs
import { deleteMany, insertMany } from './models/Product.mjs';

// Define the products to be seeded into the database
const products = [
    {
        name: 'Basic Website Design',
        productId: 'wd001',
        description: 'A simple website design suitable for small businesses.',
        price: 5000,
        image: '/images/basic-website.jpg',
        category: 'Web Development'
    },
    {
        name: 'E-commerce Website',
        productId: 'wd002',
        description: 'Full-fledged e-commerce solution with payment integration.',
        price: 15000,
        image: '/images/ecommerce-website.jpg',
        category: 'Web Development'
    },
    {
        name: 'Custom Web Application',
        productId: 'wd003',
        description: 'Tailored web application development based on specific requirements.',
        price: 25000,
        image: '/images/custom-web-app.jpg',
        category: 'Web Development'
    },
    {
        name: 'SEO Optimization',
        productId: 'wd004',
        description: 'Improve your website\'s visibility on search engines.',
        price: 8000,
        image: '/images/seo-optimization.jpg',
        category: 'Marketing'
    },
    {
        name: 'Responsive Web Design',
        productId: 'wd005',
        description: 'Ensures your website looks great on all devices and screen sizes.',
        price: 6000,
        image: '/images/responsive-design.jpg',
        category: 'Web Development'
    },
    {
        name: 'Web Maintenance',
        productId: 'wd006',
        description: 'Ongoing updates and maintenance for your website.',
        price: 4000,
        image: '/images/web-maintenance.jpg',
        category: 'Support'
    },
    {
        name: 'Graphic Design',
        productId: 'wd007',
        description: 'Custom graphics and visual content creation for your website.',
        price: 7000,
        image: '/images/graphic-design.jpg',
        category: 'Design'
    },
    {
        name: 'Hosting Services',
        productId: 'wd008',
        description: 'Reliable hosting solutions for your website.',
        price: 3000,
        image: '/images/hosting-services.jpg',
        category: 'Hosting'
    },
    {
        name: 'Domain Registration',
        productId: 'wd009',
        description: 'Register your domain name quickly and securely.',
        price: 1000,
        image: '/images/domain-registration.jpg',
        category: 'Hosting'
    },
    {
        name: 'Company Registration Assistance',
        productId: 'wd010',
        description: 'Guidance and assistance with registering your company online.',
        price: 5000,
        image: '/images/company-registration.jpg',
        category: 'Consulting'
    },
    {
        name: 'Digital Marketing',
        productId: 'wd011',
        description: 'Promote your business online with effective digital marketing strategies.',
        price: 12000,
        image: '/images/digital-marketing.jpg',
        category: 'Marketing'
    }
];

// Function to seed products into the database
async function seedProducts() {
    try {
        // Connect to MongoDB using the URI from the .env file
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Remove all existing products from the collection
        await deleteMany();
        console.log('Old products removed');

        // Insert the new products into the collection
        await insertMany(products);
        console.log('Database seeded with new products');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
}


export { seedProducts };
