import { StructureBuilder } from 'sanity/structure';

export const structure = (S: StructureBuilder) =>
    S.list()
        .title('Content')
        .items([
            // Content group
            S.listItem()
                .title('Content')
                .child(
                    S.list()
                        .title('Content')
                        .items([
                            // Posts with filter views
                            S.listItem()
                                .title('Posts')
                                .child(
                                    S.list()
                                        .title('Posts')
                                        .items([
                                            S.listItem()
                                                .title('All Posts')
                                                .child(
                                                    S.documentTypeList('post')
                                                        .title('All Posts')
                                                        .defaultOrdering([
                                                            {
                                                                field: 'date',
                                                                direction:
                                                                    'desc',
                                                            },
                                                        ])
                                                ),
                                            S.listItem()
                                                .title('Drafts')
                                                .child(
                                                    S.documentList()
                                                        .title('Draft Posts')
                                                        .filter(
                                                            '_type == "post" && _id in path("drafts.**")'
                                                        )
                                                        .defaultOrdering([
                                                            {
                                                                field: 'date',
                                                                direction:
                                                                    'desc',
                                                            },
                                                        ])
                                                ),
                                            S.listItem()
                                                .title('Published')
                                                .child(
                                                    S.documentList()
                                                        .title(
                                                            'Published Posts'
                                                        )
                                                        .filter(
                                                            '_type == "post" && !(_id in path("drafts.**"))'
                                                        )
                                                        .defaultOrdering([
                                                            {
                                                                field: 'date',
                                                                direction:
                                                                    'desc',
                                                            },
                                                        ])
                                                ),
                                            S.listItem()
                                                .title('Hidden')
                                                .child(
                                                    S.documentList()
                                                        .title('Hidden Posts')
                                                        .filter(
                                                            '_type == "post" && hidden == true'
                                                        )
                                                        .defaultOrdering([
                                                            {
                                                                field: 'date',
                                                                direction:
                                                                    'desc',
                                                            },
                                                        ])
                                                ),
                                        ])
                                ),
                            S.documentTypeListItem('gem').title('Gems'),
                        ])
                ),
            S.divider(),
            // Taxonomies group
            S.listItem()
                .title('Taxonomies')
                .child(
                    S.list()
                        .title('Taxonomies')
                        .items([
                            S.documentTypeListItem('tag').title('Tags'),
                            S.documentTypeListItem('series').title('Series'),
                        ])
                ),
            S.divider(),
            // Settings group
            S.listItem()
                .title('Settings')
                .child(
                    S.list()
                        .title('Settings')
                        .items([
                            S.documentTypeListItem('author').title('Authors'),
                        ])
                ),
        ]);
