export const KENNEL_CONFIG = {
  name: 'Puppy Power Kennel',
  location: 'Belgrade, Serbia',
  email: 'puppypowerkennel@gmail.com',
  phone: '+381 64 2623337',
  social: {
    facebook: 'https://facebook.com/happypawskennel',
    instagram: 'https://www.instagram.com/puppypowerkennel?igsh=anE2NTJ0ZHZmenA0',
  },
  breeds: [
    {
      id: 'bernese-mountain-dog',
      name: 'Bernese Mountain Dog',
      origin: 'Switzerland',
      fciGroup: 'Group 2 – Pinscher and Schnauzer',
      description:
        'Gentle giant with a tricolor coat, known for loyalty and calm temperament. Ideal family companion.',
      imagePath: 'assets/breeds/bernese-mountain-dog.jpg',
    },
    {
      id: 'maltese',
      name: 'Maltese',
      origin: 'Malta',
      fciGroup: 'Group 9 – Companion and Toy Dogs',
      description:
        'Elegant small breed with a silky white coat, playful personality and centuries of history.',
      imagePath: 'assets/breeds/maltese.jpg',
    },
    {
      id: 'bolonka-zwetna',
      name: 'Bolonka Zwetna',
      origin: 'Russia',
      fciGroup: 'Group 9 – Companion and Toy Dogs',
      description:
        'Rare colored toy breed with a curly or wavy coat, affectionate and adaptable city dog.',
      imagePath: 'assets/breeds/bolonka-zwetna.jpg',
    },
  ],
} as const;

export type Breed = (typeof KENNEL_CONFIG.breeds)[number];
