export const KENNEL_CONFIG = {
  name: 'Happy Paws Kennel',
  location: 'Belgrade, Serbia',
  email: 'info@happypawskennel.com',
  phone: '+381 11 000 0000',
  social: {
    facebook: 'https://facebook.com/happypawskennel',
    instagram: 'https://instagram.com/happypawskennel',
    youtube: 'https://youtube.com/happypawskennel',
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
