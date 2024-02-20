export const SocialMediaButtons = /*template*/ `

<!-- Social Media Buttons -->
<div class="mt-4 space-y-4">
  <a href="/auth/facebook" class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded w-full block text-center">Login with Facebook</a>
  <a href="/auth/google" class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded w-full block text-center">Login with Google</a>
</div>

`;

export const login_register_template = /*template*/ `
<main class="flex flex-row h-full w-full">
    <article x-data="{ showLogin: true }" class="container mx-auto p-4">

    <!-- Toggle Buttons -->
    <div class="flex justify-center space-x-4 mb-6">
        <button @click="showLogin = true" :class="{'bg-blue-500': showLogin, 'bg-gray-200': !showLogin}" class="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
        <button @click="showLogin = false" :class="{'bg-blue-500': !showLogin, 'bg-gray-200': showLogin}" class="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Register</button>
    </div>

    <!-- Login Form -->
    <div x-show="showLogin">
        <h2 class="text-2xl font-bold mb-2">Login</h2>
        <form action="/login" method="post" hx-post="/login" hx-target="#response">
        
        
        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
        </div>
        <div class="flex items-center justify-between">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Sign In
            </button>
            <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            Forgot Password?
            </a>
        </div>
        </form>
    </div>

    <!-- Register Form -->
    <div x-show="!showLogin">
        <h2 class="text-2xl font-bold mb-2">Register</h2>
        <form action="/register" method="post" hx-post="/register" hx-target="#response">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email">
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="new-password">Password</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="new-password" type="password" placeholder="Password">
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm-password">Confirm Password</label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="confirm-password" type="password" placeholder="Confirm Password">
            </div>
            <div class="flex items-center justify-between">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Register
                </button>
            </div>
        </form>
    </div>
${SocialMediaButtons}   
    </article>
</main>
`;
