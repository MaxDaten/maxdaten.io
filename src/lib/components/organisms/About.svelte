<script>
    import Socials from '$lib/components/molecules/Socials.svelte';
    import { FxReveal as Img } from '@zerodevx/svelte-img';
    import MeSrc from '$assets/images/authors/jloos.png?as=run&fit=cover';
    import { authors } from '$lib/data/authors';

    const jloos = authors.jloos;
</script>

<section id="about">
    <div class="info">
        <h2>Hi there! I'm Jan-Philip</h2>
        <p>
            a software engineer and DevOps consultant from Hamburg, Germany.
            With a Master's in Computer Science, I help businesses build robust,
            scalable infrastructure and streamline their development workflows.
        </p>
        <p>
            My expertise spans cloud-native architectures, Infrastructure as
            Code, and modern DevOps practices. I'm passionate about functional
            programming, automation, and creating solutions that make complex
            systems simple and reliable.
        </p>
        <p>
            Currently working as a freelance consultant, I partner with teams to
            transform their technical infrastructure and accelerate their
            delivery capabilities.
        </p>
        <p class="specialties">
            <strong>Specializing in:</strong> Kubernetes • Google Cloud Platform
            • Infrastructure as Code • CI/CD Automation • Secret Management • Cloud
            Security
        </p>
        <div class="socials">
            <span>Let's connect:</span>
            <Socials {...jloos.socials} />
        </div>
    </div>
    <div class="image">
        <Img
            src={MeSrc}
            {...{
                class: 'me-image',
                alt: 'Comic drawing of a blond bearded guy',
                sizes: '(max-width: 1024px) 400px, 800px',
            }}
            --reveal-transition="opacity 400ms ease-in, transform 0.8s ease-out;"
        />
    </div>
</section>

<style>
    #about {
        position: relative;
        display: grid;
        grid-template-columns: 500px 0.8fr;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 50px;

        @media (max-width: 767px) {
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 20px;
        }

        .info {
            display: flex;
            flex-direction: column;
            gap: 15px;

            h2 {
                @media (max-width: 767px) {
                    text-align: center;
                    text-wrap: balance;
                }
            }

            p {
                line-height: 1.6;

                @media (max-width: 767px) {
                    text-align: justify;
                    max-inline-size: 50ch;
                    text-wrap: pretty;
                }
            }

            .specialties {
                font-size: 0.95rem;
                color: rgba(var(--color--text-shade-rgb), 0.8);
                padding: 12px 16px;
                background: rgba(var(--color--primary-rgb), 0.1);
                border-radius: 8px;
                border-left: 3px solid rgba(var(--color--primary-rgb), 0.4);
            }

            @media (max-width: 767px) {
                gap: 20px;
            }
        }

        .socials {
            display: flex;
            align-items: center;
            gap: 15px;

            @media (max-width: 767px) {
                justify-content: center;
                margin-bottom: 10px;
                span {
                    display: none;
                }
            }
        }

        .image {
            border-radius: 10%;
            border: 8px solid rgba(var(--color--primary-rgb), 0.05);
            overflow: hidden;
            mix-blend-mode: color-burn;

            :global(.me-image) {
                height: 100%;
                object-fit: cover;
                object-position: center;
            }
        }
    }
</style>
