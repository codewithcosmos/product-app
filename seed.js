const Product = require('./models/Product');

const products = [
    {
        name: 'Basic Website Design',
        productId: 'wd001',
        description: 'A simple website design suitable for small businesses.',
        price: 5000,
        image: '/images/basic-website.jpg', // Adjusted path
        category: 'Web Development'
    },
    {
        name: 'E-commerce Website',
        productId: 'wd002',
        description: 'Full-fledged e-commerce solution with payment integration.',
        price: 15000,
        image: '/images/ecommerce-website.jpg', // Adjusted path
        category: 'Web Development'
    },
    {
        name: 'Custom Web Application',
        productId: 'wd003',
        description: 'Tailored web application development based on specific requirements.',
        price: 25000,
        image: '/images/custom-web-app.jpg', // Adjusted path
        category: 'Web Development'
    },
    {
        name: 'SEO Optimization',
        productId: 'wd004',
        description: 'Improve your website\'s visibility on search engines.',
        price: 8000,
        image: '/images/seo-optimization.jpg', // Adjusted path
        category: 'Marketing'
    },
    {
        name: 'Responsive Web Design',
        productId: 'wd005',
        description: 'Ensures your website looks great on all devices and screen sizes.',
        price: 6000,
        image: '/images/responsive-design.jpg', // Adjusted path
        category: 'Web Development'
    },
    {
        name: 'Web Maintenance',
        productId: 'wd006',
        description: 'Ongoing updates and maintenance for your website.',
        price: 4000,
        image: '/images/web-maintenance.jpg', // Adjusted path
        category: 'Support'
    },
    {
        name: 'Graphic Design',
        productId: 'wd007',
        description: 'Custom graphics and visual content creation for your website.',
        price: 7000,
        image: '/images/graphic-design.jpg', // Adjusted path
        category: 'Design'
    },
    {
        name: 'Hosting Services',
        productId: 'wd008',
        description: 'Reliable hosting solutions for your website.',
        price: 3000,
        image: '/images/hosting-services.jpg', // Adjusted path
        category: 'Hosting'
    },
    {
        name: 'Domain Registration',
        productId: 'wd009',
        description: 'Register your domain name quickly and securely.',
        price: 1000,
        image: '/images/domain-registration.jpg', // Adjusted path
        category: 'Hosting'
    },
    {
        name: 'Company Registration Assistance',
        productId: 'wd010',
        description: 'Guidance and assistance with registering your company online.',
        price: 5000,
        image: '/images/company-registration.jpg', // Adjusted path
        category: 'Consulting'
    },
    {
        name: 'Digital Marketing',
        productId: 'wd011',
        description: 'Promote your business online with effective digital marketing strategies.',
        price: 12000,
        image: '/images/digital-marketing.jpg', // Adjusted path
        category: 'Marketing'
    }
];

async function seedProducts() {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Database seeded');
}

module.exports = seedProducts;
