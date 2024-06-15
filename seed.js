// seed.js
const Product = require('./models/Product');

const products = [
    {
        name: 'Basic Website Design',
        productId: 'wd001',
        description: 'A simple website design suitable for small businesses.',
        price: 5000,
        image: 'basic-website.jpg',
        category: 'Web Development' // Add category here
    },
    {
        name: 'E-commerce Website',
        productId: 'wd002',
        description: 'Full-fledged e-commerce solution with payment integration.',
        price: 15000,
        image: 'ecommerce-website.jpg',
        category: 'Web Development' // Add category here
    },
    {
        name: 'Custom Web Application',
        productId: 'wd003',
        description: 'Tailored web application development based on specific requirements.',
        price: 25000,
        image: 'custom-web-app.jpg',
        category: 'Web Development' // Add category here
    },
    {
        name: 'SEO Optimization',
        productId: 'wd004',
        description: 'Improve your website\'s visibility on search engines.',
        price: 8000,
        image: 'seo-optimization.jpg',
        category: 'Marketing' // Add category here
    },
    {
        name: 'Responsive Web Design',
        productId: 'wd005',
        description: 'Ensures your website looks great on all devices and screen sizes.',
        price: 6000,
        image: 'responsive-design.jpg',
        category: 'Web Development' // Add category here
    },
    {
        name: 'Web Maintenance',
        productId: 'wd006',
        description: 'Ongoing updates and maintenance for your website.',
        price: 4000,
        image: 'web-maintenance.jpg',
        category: 'Support' // Add category here
    },
    {
        name: 'Graphic Design',
        productId: 'wd007',
        description: 'Custom graphics and visual content creation for your website.',
        price: 7000,
        image: 'graphic-design.jpg',
        category: 'Design' // Add category here
    },
    {
        name: 'Hosting Services',
        productId: 'wd008',
        description: 'Reliable hosting solutions for your website.',
        price: 3000,
        image: 'hosting-services.jpg',
        category: 'Hosting' // Add category here
    },
    {
        name: 'Domain Registration',
        productId: 'wd009',
        description: 'Register your domain name quickly and securely.',
        price: 1000,
        image: 'domain-registration.jpg',
        category: 'Hosting' // Add category here
    },
    {
        name: 'Company Registration Assistance',
        productId: 'wd010',
        description: 'Guidance and assistance with registering your company online.',
        price: 5000,
        image: 'company-registration.jpg',
        category: 'Consulting' // Add category here
    },
    {
        name: 'Digital Marketing',
        productId: 'wd011',
        description: 'Promote your business online with effective digital marketing strategies.',
        price: 12000,
        image: 'digital-marketing.jpg',
        category: 'Marketing' // Add category here
    }
];

async function seedProducts() {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Database seeded');
}

module.exports = seedProducts;
