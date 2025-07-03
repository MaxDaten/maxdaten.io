<script>
    import Socials from '$lib/components/molecules/Socials.svelte';
    import Image from '../atoms/Image.svelte';
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
            systems simple and reliable. Currently working as a freelance
            consultant, I partner with teams to transform their technical
            infrastructure and accelerate their delivery capabilities.
        </p>
        <p class="specialties">
            <strong>Specializing in:</strong> Kubernetes • Google Cloud Platform
            • Infrastructure as Code • CI/CD Automation • Secret Management • Cloud
            Security
        </p>
        <div class="socials">
            <span>Let's connect:</span>
            <Socials />
        </div>
    </div>
    <div class="image">
        <Image
            src="/images/me.png"
            alt="A manga comic drawing of Jan-Philip Loos sitting in front of a window showing a cyberpunk city"
        />
    </div>
</section>

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    #about {
        position: relative;
        display: grid;
        grid-template-columns: 500px 250px;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 50px;

        @include breakpoints.for-phone-only {
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 20px;
        }

        .info {
            display: flex;
            flex-direction: column;
            gap: 15px;
            h2 {
                @include breakpoints.for-phone-only {
                    text-align: center;
                    text-wrap: balance;
                }
            }

            p {
                line-height: 1.6;

                @include breakpoints.for-phone-only {
                    text-align: justify;
                    max-inline-size: 50ch;
                    text-wrap: balance;
                }
            }

            .specialties {
                font-size: 0.95rem;
                color: rgba(var(--color--text-shade-rgb), 0.8);
                padding: 12px 16px;
                background: rgba(var(--color--primary-rgb), 0.05);
                border-radius: 8px;
                border-left: 3px solid rgba(var(--color--primary-rgb), 0.4);
            }

            @include breakpoints.for-phone-only {
                gap: 20px;
            }
        }

        .socials {
            display: flex;
            align-items: center;
            gap: 15px;

            @include breakpoints.for-phone-only {
                justify-content: center;
                margin-bottom: 10px;
                span {
                    display: none;
                }
            }
        }

        .image {
            width: 220px;
            height: 220px;
        }

        :global(.image img) {
            border-radius: 10%;
        }
    }
</style>
