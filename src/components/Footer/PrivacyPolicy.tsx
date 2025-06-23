import { Header, Footer, Breadcrumbs, Heading, Paragraph } from "../index";


const PrivacyPolicy = () => {
    return (
        <div className="w-screen">
            <Header />
            <main className="container mx-auto max-md:px-3 lg:px-48 py-8">
                <Breadcrumbs
                    links={[
                        { label: "Главная", href: "/" },
                        { label: "Политика конфиденциальности" }
                    ]}
                />
                <Heading className="text-2xl font-bold my-4" text={"Политика конфиденциальности"} level={2}></Heading>
                <Paragraph className="text-base leading-7 text-gray-700 text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at velit quam. Vivamus sed magna ut ante consectetur ullamcorper at nec purus. Nunc venenatis consequat justo, ut aliquam massa. Quisque interdum euismod egestas. Suspendisse ut varius erat, ut vulputate dui. Integer sodales mi sed ipsum accumsan, eu suscipit dolor viverra. Suspendisse congue sem id bibendum venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin urna tortor, aliquam ut tempor ac, tempus vitae ante. Vivamus faucibus ornare mollis. Ut id imperdiet sem, vitae semper tellus.

                    Vivamus dictum, dui eget euismod hendrerit, libero urna mollis nunc, sed pellentesque libero lorem at ante. Maecenas commodo commodo elit ac feugiat. Aliquam eget cursus ante. Etiam sapien urna, tempus quis imperdiet at, vulputate et justo. Quisque auctor magna mi, id malesuada sapien fermentum id. In in arcu vitae ligula vestibulum gravida vel dapibus metus. Cras ac lobortis eros, vitae efficitur tortor. Nam vel posuere quam. Sed dictum lacinia nisl, quis luctus magna commodo eu. Aliquam sed quam sapien. Vestibulum elementum vitae leo vel semper. Vivamus mauris mi, fermentum sed convallis et, vestibulum eget purus. Pellentesque vel magna vitae massa facilisis rhoncus.

                    Donec egestas enim ac enim vulputate rutrum. Phasellus lobortis bibendum turpis a ultrices. Mauris felis diam, facilisis nec enim sit amet, vehicula dignissim sapien. Proin suscipit dictum cursus. Etiam vel condimentum ipsum, sed imperdiet odio. Nullam bibendum lacus et erat condimentum ullamcorper. Integer malesuada lorem sed lorem pretium lacinia. Morbi non diam tortor. Maecenas sodales sem ut pellentesque laoreet. Duis lobortis dignissim velit, sit amet euismod quam sollicitudin at. Donec risus quam, condimentum eu nulla vitae, ultrices placerat dolor. Sed nec dapibus elit.

                    Aliquam aliquet ligula sit amet orci venenatis blandit. Aliquam augue tortor, lobortis sit amet odio ut, posuere mattis lectus. Nullam rhoncus, nibh eu pharetra imperdiet, lorem mauris auctor urna, a imperdiet orci massa eu est. Sed felis magna, facilisis sed massa eu, dignissim faucibus magna. Pellentesque in diam libero. Vivamus elementum velit non nisi facilisis tincidunt. Cras a ullamcorper libero. Nullam ullamcorper, ligula ac convallis ornare, mi magna sollicitudin urna, vel ultricies lacus lacus a turpis.

                    Etiam sed est a purus posuere vestibulum et a nulla. Pellentesque mattis massa id risus elementum, eget suscipit nunc imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras magna augue, egestas quis mauris a, porta volutpat lacus. Quisque iaculis ac purus vel porta. Proin consectetur diam in ligula ullamcorper tincidunt. Nullam porttitor ipsum sapien, vitae rutrum ligula placerat sit amet. Etiam dapibus euismod arcu.
                </Paragraph>
            </main>
            <Footer showSmallFooter={true} />
        </div>
    );
};

export default PrivacyPolicy;
