

export function set_resource_urls(slug: string, url_prefix = 'admin') {
    const normalizedPrefix = url_prefix.endsWith('/') ? url_prefix.slice(0, -1) : url_prefix;

    return {
        get_url_paths: {
            index: `/${normalizedPrefix}/cms/collection/${slug}/landing`,
            create: `/${normalizedPrefix}/cms/collection/${slug}/create`,
            show: `/${normalizedPrefix}/cms/collection/${slug}/show/:id`,
            edit: `/${normalizedPrefix}/cms/collection/${slug}/edit/:id`,
        },

        post_url_paths: {
            edit: `/${normalizedPrefix}/cms/collection/_post_/${slug}/edit`,
            create: `/${normalizedPrefix}/cms/collection/_post_/${slug}/create`,
            create_redirect: `/${normalizedPrefix}/cms/collection/_post_/${slug}/create_redirect`,
            paginate: `/${normalizedPrefix}/cms/collection/_post_/${slug}/paginate`
        }

    }

}


export function set_cms_control_plane_urls(url_prefix = 'admin') {
    // Ensure the prefix does not end with a slash for consistency
    const normalizedPrefix = url_prefix.endsWith('/') ? url_prefix.slice(0, -1) : url_prefix;


    return {
        dashboard: `/${normalizedPrefix}/cms/dashboard`,
        // Add more CMS control plane specific URLs here
    };
}
