import React from 'react';
import { BrainCircuit, Figma, Database, Map, PenTool, ExternalLink } from 'lucide-react';

const SkillsetHub: React.FC = () => {
  const skillCategories = [
    {
      title: 'Design & Prototyping',
      icon: Figma,
      color: 'bg-purple-100 text-purple-600',
      skills: [
        {
          name: 'Figma Fundamentals',
          description: 'Learn wireframing, prototyping, and design handoffs',
          level: 'Beginner',
          link: 'https://www.figma.com/resource-library/design-basics/'
        },
        {
          name: 'User Experience Design',
          description: 'Create user flows and design thinking processes',
          level: 'Intermediate',
          link: 'https://www.coursera.org/google-certificates/google-ux-design?utm_source=google&utm_medium=institutions&utm_campaign=sou--google__med--paidsearch__cam--ha-sem-sk-bro-ux__geo%E2%80%94US__con--RSA-DR__ter--ux%20design%20course&gwg_campaign_id=22445192107&gwg_exp=null&gwg_ad_id=GCLID--CjwKCAjwvO7CBhAqEiwA9q2YJUtO3CL3YauC0PQqQ02XBnI31eb8I9-p_mK6gAABtL2zl0P7ru6TxBoC50kQAvD_BwE__GBRAID--0AAAAADEWTLVYWnxAysZ-dk0KEw-VkY57r'
        }
      ]
    },
    {
      title: 'Documentation & Organization',
      icon: PenTool,
      color: 'bg-blue-100 text-blue-600',
      skills: [
        {
          name: 'Notion for PMs',
          description: 'Master project management and documentation',
          level: 'Beginner',
          link: 'https://www.notion.com/help/guides/this-project-management-system-connects-the-dots-for-your-product-team'
        },
        {
          name: 'PRD Writing',
          description: 'Write clear product requirements documents',
          level: 'Intermediate',
          link: 'https://carlinyuen.medium.com/writing-prds-and-product-requirements-2effdb9c6def'
        }
      ]
    },
    {
      title: 'Data & Analytics',
      icon: Database,
      color: 'bg-green-100 text-green-600',
      skills: [
        {
          name: 'SQL Basics',
          description: 'Query databases and analyze product metrics',
          level: 'Beginner',
          link: 'https://goizueta.emory.edu/undergraduate-business-degree/student-handbook.pdf'
        },
        {
          name: 'Analytics Frameworks',
          description: 'Set up KPIs and measure product success',
          level: 'Intermediate',
          link: 'https://www.atlassian.com/agile/product-management/product-management-kpis#:~:text=Product%20management%20KPIs:%20Frequently%20asked%20questions&text=The%20frequency%20of%20reviewing%20product,reviews%20for%20a%20strategic%20perspective.'
        }
      ]
    },
    {
      title: 'Strategy & Planning',
      icon: Map,
      color: 'bg-orange-100 text-orange-600',
      skills: [
        {
          name: 'Product Roadmapping',
          description: 'Create and communicate product strategy',
          level: 'Intermediate',
          link: 'https://asana.com/uses/timeline?utm_campaign=namer_us_en_mlti_mlti_search_google_nb_tier-2-use-cases&utm_source=google&utm_medium=pd_cpc_nb&gad_source=1&gad_campaignid=22254876621&gbraid=0AAAAADMr21xHSZnfOTOgqNFM_pes8uf7n&gclid=CjwKCAjwvO7CBhAqEiwA9q2YJZH1A0LKJKnhsNpcRjCA9sU7t1TrJ_zMOG-SYTJsQ06Nw7HtPKNnWRoCSVoQAvD_BwE&gclsrc=aw.ds'
        },
        {
          name: 'Prioritization Frameworks',
          description: 'Master RICE, MoSCoW, and other methods',
          level: 'Beginner',
          link: 'https://www.atlassian.com/agile/product-management/prioritization-framework'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BrainCircuit className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Skillset Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the essential tools and skills every product manager needs. 
            From design thinking to data analysis, build your PM toolkit step by step.
          </p>
        </div>

        {/* Skill Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        skill.level === 'Beginner' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{skill.description}</p>
                    {skill.link ? (
                      <a
                        href={skill.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        <span>Start Learning</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Start Learning →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsetHub;