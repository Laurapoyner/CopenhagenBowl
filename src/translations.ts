export interface Translation {
    nav: {
        home: string;
        divisions: string;
        rules: string;
        officiating: string;
        history: string;
        partners: string;
    };
    hero: {
        title: string;
        subtitle: string;
        date: string;
        location: string;
        cta: string;
    };
    divisions: {
        title: string;
        mens: string;
        womens: string;
        coed: string;
        leisure: string;
        competitive: string;
        elite: string;
        coed_rule: string;
    };
    rules: {
        title: string;
        general: string;
        coed: string;
        tiebreaker: string;
        cheat_sheet: string;
    };
    officiating: {
        title: string;
        subtitle: string;
        signup: string;
    };
    history: {
        title: string;
        subtitle: string;
        results: string;
        download_pdf: string;
    };
    contact: {
        title: string;
        subtitle: string;
        facebook: string;
        instagram: string;
    };
    personnel: {
        title: string;
        martin: {
            role: string;
            name: string;
            email: string;
            phone: string;
        };
        claes: {
            role: string;
            name: string;
            email: string;
            phone: string;
        };
        laura: {
            role: string;
            name: string;
            note: string;
        };
    };
    qa: {
        title: string;
        toilets: { q: string; a: string };
        photos: { q: string; a: string };
    };
}

export const t: Translation = {
    nav: {
        home: 'Home',
        divisions: 'Divisions',
        rules: 'Rules',
        officiating: 'Officiating',
        history: 'History',
        partners: 'Partners',
    },
    hero: {
        title: 'Copenhagen Bowl 2026',
        subtitle: "Europe's Largest Flag Football Tournament",
        date: 'May 23-24, 2026',
        location: 'Valby Idrætspark, Copenhagen',
        cta: 'Register Team',
    },
    divisions: {
        title: 'Divisions',
        mens: "Men's Divisions",
        womens: 'Women',
        coed: 'Co-Ed',
        leisure: 'Leisure',
        competitive: 'Competitive',
        elite: 'Elite',
        coed_rule: 'Min. 2 women on field',
    },
    rules: {
        title: 'Tournament Rules',
        general: 'General Rules',
        coed: 'Co-Ed Rules',
        tiebreaker: 'Tie-Breaker',
        cheat_sheet: 'Cheat Sheet',
    },
    officiating: {
        title: 'Officiating Clinic',
        subtitle: 'Learn from the best IFAF officials',
        signup: 'Sign up for Clinic',
    },
    history: {
        title: 'History & Results',
        subtitle: 'A decade of flag football excellence. Celebrating champions across all divisions.',
        results: 'Five Champions',
        download_pdf: 'Download Results PDF',
    },
    contact: {
        title: 'Questions?',
        subtitle: 'For more information or specific inquiries, feel free to reach out on our social media platforms.',
        facebook: 'Ask on Facebook',
        instagram: 'Ask on Instagram',
    },
    personnel: {
        title: 'Contact Us',
        martin: {
            role: 'Founder CEO',
            name: 'Martin Andersen',
            email: 'martin_200186@hotmail.com',
            phone: '+45 51 54 99 52 (No WhatsApp)',
        },
        claes: {
            role: 'Tournament structure, schedule & officiating clinic',
            name: 'Claes Scherwin Thalmann',
            email: 'Claesscherwin@gmail.com',
            phone: '+45 61 61 17 19',
        },
        laura: {
            role: 'Web & Graphics',
            name: 'Laura Poyner',
            note: 'Please contact Martin or Claes.',
        },
    },
    qa: {
        title: 'Q&A',
        toilets: {
            q: 'Where can I find toilets?',
            a: 'Toilets and changing rooms are located in Hafnia-Hallen (Julius Andersens Vej 6, 2450 København)',
        },
        photos: {
            q: 'Where can I find pictures from the event?',
            a: 'Pictures are shared on our Facebook and Instagram. Check out 1stdownphoto.dk for professional shots.',
        },
    },
};
