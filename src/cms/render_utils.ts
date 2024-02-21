import { PaginationQuery } from "../ChatHTMX/DB/FBR_ChatDBSupport";

export function WrappedWithPaginationAndList(paginatedData: PaginationQuery<any>, content: string, post_url: string, defaultLimit: number) {

    function generateId() {
        const randomPart = Math.random().toString(36).substring(2, 15);
        const timePart = new Date().getTime().toString(36);
        return 'id_' + timePart + randomPart;
    }

    const form_id = generateId();

    // Dynamic generation of pagination buttons
    const paginationButtonsHtml = Array.from({ length: paginatedData.totalPages }, (_, i) => /*template*/`
  <button type="button" class="pagination-btn py-2 px-3 leading-tight text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700" data-page="${i + 1}">${i + 1}</button>
`).join('');


    // Select option dynamically based on defaultLimit
    const optionsHtml = [3, 10, 20, 50].map(limit => `
      <option value="${limit}" ${limit === defaultLimit ? 'selected' : ''}>${limit} per page</option>
    `).join('');

    const template =  /*template*/`
<div id="${form_id}" >
    <div  class="container mx-auto p-6">
        <div class="bg-white p-4 rounded-md shadow-md">
            ${content}
        </div>
        
        <form id="paginationForm">
            <div class="flex justify-between items-center mt-6">
                <select name="limit" class="border p-2 rounded">
                    ${optionsHtml}
                </select>
                <nav aria-label="Page navigation">
                    <ul class="inline-flex items-center -space-x-px">
                        <li>
                            <button type="button" class="prev-btn py-2 px-3 leading-tight bg-white border border-gray-300 hover:bg-gray-100" ${!paginatedData.hasPrevPage ? 'disabled' : ''} data-page="${paginatedData.prevPage}">Previous</button>
                        </li>
                        ${paginationButtonsHtml}
                        <li>
                            <button type="button" class="next-btn py-2 px-3 leading-tight bg-white border border-gray-300 hover:bg-gray-100" ${!paginatedData.hasNextPage ? 'disabled' : ''} data-page="${paginatedData.nextPage}">Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </form>
    </div>

    <script>

    $(document).ready(function() {
        // Handle clicks on pagination buttons, including Next and Previous
        $('.pagination-btn, .prev-btn, .next-btn').on('click', function() {
            const page = $(this).data('page');
            updateList(page, $('#paginationForm select[name="limit"]').val());
        });

        // Handle limit changes
        $('#paginationForm select[name="limit"]').change(function() {
            updateList(1, $(this).val()); // Always revert to the first page when changing the limit
        });
        
        function updateList(page, limit) {
            $.ajax({
                type: "POST",
                url: "${post_url}",
                data: { page: page, limit: limit },
                success: function(response) {
                    // Update your list with the response data
                    $('#${form_id}').replaceWith(response);
                },
                error: function(error) {
                    console.error('Failed to update page:', error);
                }
            });
        }
    });
    </script>
</div>
  `;


    return template;
}

// Assuming `paginatedData` is your data object containing the pagination info and list of configs,
// and `basePath` is the root path for your detail and edit routes.
// You'll need to implement `updateList(page, limit)` to handle pagination and limit changes.
