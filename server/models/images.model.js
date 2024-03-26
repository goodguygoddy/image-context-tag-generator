'use strict';

const getImagesSchema = {
    querystring: {
        search: { type: 'string' }
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                context: { type: 'string' },
                tags: {
                    type: 'array',
                    items: { type: 'string' }
                },
                source: { type: 'string' }
                }
            }
        }
    }
};

export { getImagesSchema }