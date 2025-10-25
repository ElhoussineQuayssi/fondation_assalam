/**
 * @typedef {Object} ContentSection
 * @property {string} heading
 * @property {string} text
 */

/**
 * @typedef {Object} TimelineItem
 * @property {string} year
 * @property {string[]} events
 */

/**
 * @typedef {Object} FAQ
 * @property {string} question
 * @property {string} answer
 */

/**
 * @typedef {Object} Testimonial
 * @property {string} name
 * @property {string} role
 * @property {string} content
 * @property {string} shortContent
 */

/**
 * @typedef {Object} RelatedProject
 * @property {string} title
 * @property {string} excerpt
 * @property {string} image
 * @property {string} slug
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} excerpt
 * @property {string} image
 * @property {string[]} categories
 * @property {string} startDate
 * @property {string} location
 * @property {string} peopleHelped
 * @property {string} status
 * @property {ContentSection[]} content
 * @property {string[]} goals
 * @property {TimelineItem[]} timeline
 * @property {FAQ[]} faqs
 * @property {Testimonial[]} testimonials
 * @property {string[]} gallery
 * @property {RelatedProject[]} relatedProjects
 */

export default {};
